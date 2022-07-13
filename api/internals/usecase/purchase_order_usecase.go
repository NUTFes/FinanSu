package usecase

import (
	"context"
	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	"strconv"
	"fmt"
)

type purchaseOrderUseCase struct {
	rep rep.PurchaseOrderRepository
}

type PurchaseOrderUseCase interface {
	GetPurchaseOrders(context.Context) ([]domain.PurchaseOrder, error)
	GetPurchaseOrderByID(context.Context, string) (domain.PurchaseOrder, error)
	CreatePurchaseOrder(context.Context, string, string) error
	UpdatePurchaseOrder(context.Context, string, string, string) error
	DestroyPurchaseOrder(context.Context, string) error
	GetOrderWithUserItem(context.Context) ([]domain.OrderWithItemAndUser,error)
}

func NewPurchaseOrderUseCase(rep rep.PurchaseOrderRepository) PurchaseOrderUseCase {
	return &purchaseOrderUseCase{rep}
}

//PurchaseOrdersの取得(Gets)
func (p *purchaseOrderUseCase) GetPurchaseOrders(c context.Context) ([]domain.PurchaseOrder, error)	{
	purchaseOrder := domain.PurchaseOrder{}
		var purchaseOrders []domain.PurchaseOrder
		rows , err := p.rep.All(c)
		if err != nil {
			return nil, err
		}
		for rows.Next() {
			err := rows.Scan(
				&purchaseOrder.ID,
				&purchaseOrder.DeadLine,
				&purchaseOrder.UserID,
				&purchaseOrder.CreatedAt,
				&purchaseOrder.UpdatedAt,
			)
			if err != nil {
				return nil, err
			}
			purchaseOrders = append(purchaseOrders, purchaseOrder)
		}
		return purchaseOrders, nil
}

//PurchaseOrderの取得(Get)
func (p *purchaseOrderUseCase) GetPurchaseOrderByID(c context.Context, id string) (domain.PurchaseOrder, error){
	purchaseOrder := domain.PurchaseOrder{}
	row, err := p.rep.Find(c, id)
	err = row.Scan(
		&purchaseOrder.ID,
		&purchaseOrder.DeadLine,
		&purchaseOrder.UserID,
		&purchaseOrder.CreatedAt,
		&purchaseOrder.UpdatedAt,
	)
	if err != nil {
		return purchaseOrder, err
	}
	return purchaseOrder, nil
}

//PurcahseOrderの作成(create)
func (p *purchaseOrderUseCase) CreatePurchaseOrder(
	c context.Context, 
	userID string,
	DeadLine string,
) error {
	err := p.rep.Create(c, userID, DeadLine)
	return err
}

//PurchaseOrderの修正(Update)
func (p *purchaseOrderUseCase) UpdatePurchaseOrder(
	c context.Context,
	id string,
	userID string,
	DeadLine string,
) error {
	err := p.rep.Update(c, id, userID, DeadLine)
	return err
}

//PurchaseOrderの削除(delete)
func (p *purchaseOrderUseCase) DestroyPurchaseOrder(
	c context.Context,
	id string,
)error {
	err := p.rep.Delete(c, id)
	return err
}

func (p *purchaseOrderUseCase) GetOrderWithUserItem(c context.Context) ([]domain.OrderWithItemAndUser,error){
	orderWithUserAndItem := domain.OrderWithItemAndUser{}
	var orderWithUserAndItems []domain.OrderWithItemAndUser
	purchaseItem := domain.PurchaseItem{}
	var purchaseItems []domain.PurchaseItem
	rows, err := p.rep.AllOrderWithUser(c)
	if err != nil {
		return nil, err
	}
	for rows.Next(){
		err := rows.Scan(
			&orderWithUserAndItem.PurchaseOrder.ID,
			&orderWithUserAndItem.PurchaseOrder.DeadLine,
			&orderWithUserAndItem.PurchaseOrder.UserID,
			&orderWithUserAndItem.PurchaseOrder.CreatedAt,
			&orderWithUserAndItem.PurchaseOrder.UpdatedAt,
			&orderWithUserAndItem.User.ID,
			&orderWithUserAndItem.User.Name,
			&orderWithUserAndItem.User.BureauID,
			&orderWithUserAndItem.User.RoleID,
			&orderWithUserAndItem.User.CreatedAt,
			&orderWithUserAndItem.User.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		rows, err := p.rep.GetPurchaseItemByOrderId(c, strconv.Itoa(int(orderWithUserAndItem.PurchaseOrder.ID)))
		for rows.Next(){
			err := rows.Scan(
				&purchaseItem.ID,
				&purchaseItem.Item,
				&purchaseItem.Price,
				&purchaseItem.Quantity,
				&purchaseItem.Detail,
				&purchaseItem.Url,
				&purchaseItem.PurchaseOrderID,
				&purchaseItem.FinansuCheck,
				&purchaseItem.CreatedAt,
				&purchaseItem.UpdatedAt,
			)
			if err != nil {
				return nil, err
			}
			purchaseItems = append(purchaseItems,purchaseItem)
		}
		orderWithUserAndItem.PurchaseItem = purchaseItems
		orderWithUserAndItems = append(orderWithUserAndItems,orderWithUserAndItem)
		fmt.Println(purchaseItems)
		purchaseItems = nil
	}
	return orderWithUserAndItems,nil
}



