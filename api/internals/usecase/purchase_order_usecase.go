package usecase

import (
	"context"
	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/pkg/errors"
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
	GetOrdersTieOther(context.Context) ([]domain.OrderWithItemAndUser,error)
	GetOrdersTieOtherByID(context.Context, string) (domain.OrderWithItemAndUser,error)
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

//PurchaseOrderの紐づくPurchaseItemとUserの取得
func (p *purchaseOrderUseCase) GetOrdersTieOther(c context.Context) ([]domain.OrderWithItemAndUser,error) {
	
	orderWithItemAndUser := domain.OrderWithItemAndUser{}
	var orderWithItemAndUsers []domain.OrderWithItemAndUser
	rows , err := p.rep.AllTieOther(c)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		err := rows.Scan(
			&orderWithItemAndUser.PurchaseItem.ID,
			&orderWithItemAndUser.PurchaseItem.Item,
			&orderWithItemAndUser.PurchaseItem.Price,
			&orderWithItemAndUser.PurchaseItem.Quantity,
			&orderWithItemAndUser.PurchaseItem.Detail,
			&orderWithItemAndUser.PurchaseItem.Url,
			&orderWithItemAndUser.PurchaseItem.PurchaseOrderID,
			&orderWithItemAndUser.PurchaseItem.FinansuCheck,
			&orderWithItemAndUser.PurchaseItem.CreatedAt,
			&orderWithItemAndUser.PurchaseItem.UpdatedAt,
			&orderWithItemAndUser.PurchaseOrder.ID,
			&orderWithItemAndUser.PurchaseOrder.DeadLine,
			&orderWithItemAndUser.PurchaseOrder.UserID,
			&orderWithItemAndUser.PurchaseOrder.CreatedAt,
			&orderWithItemAndUser.PurchaseOrder.UpdatedAt,
			&orderWithItemAndUser.User.ID,
			&orderWithItemAndUser.User.Name,
			&orderWithItemAndUser.User.BureauID,
			&orderWithItemAndUser.User.RoleID,
			&orderWithItemAndUser.User.CreatedAt,
			&orderWithItemAndUser.User.UpdatedAt,
		)
		if err != nil {
			return nil, errors.Wrapf(err, "cannot connect SQL")
		}
		orderWithItemAndUsers = append(orderWithItemAndUsers,orderWithItemAndUser)
	}
	return orderWithItemAndUsers, nil
}

func (p *purchaseOrderUseCase) GetOrdersTieOtherByID(c context.Context, id string) (domain.OrderWithItemAndUser, error) {
	orderWithItemAndUser := domain.OrderWithItemAndUser{}
	row ,err :=p.rep.FindTieOther(c, id)

	err = row.Scan(
			&orderWithItemAndUser.PurchaseItem.ID,
			&orderWithItemAndUser.PurchaseItem.Item,
			&orderWithItemAndUser.PurchaseItem.Price,
			&orderWithItemAndUser.PurchaseItem.Quantity,
			&orderWithItemAndUser.PurchaseItem.Detail,
			&orderWithItemAndUser.PurchaseItem.Url,
			&orderWithItemAndUser.PurchaseItem.PurchaseOrderID,
			&orderWithItemAndUser.PurchaseItem.FinansuCheck,
			&orderWithItemAndUser.PurchaseItem.CreatedAt,
			&orderWithItemAndUser.PurchaseItem.UpdatedAt,
			&orderWithItemAndUser.PurchaseOrder.ID,
			&orderWithItemAndUser.PurchaseOrder.DeadLine,
			&orderWithItemAndUser.PurchaseOrder.UserID,
			&orderWithItemAndUser.PurchaseOrder.CreatedAt,
			&orderWithItemAndUser.PurchaseOrder.UpdatedAt,
			&orderWithItemAndUser.User.ID,
			&orderWithItemAndUser.User.Name,
			&orderWithItemAndUser.User.BureauID,
			&orderWithItemAndUser.User.RoleID,
			&orderWithItemAndUser.User.CreatedAt,
			&orderWithItemAndUser.User.UpdatedAt,
	)
	if err != nil {
		return orderWithItemAndUser, err
	}
	return orderWithItemAndUser, nil
}