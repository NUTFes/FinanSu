package usecase

import (
	"context"
	"strconv"

	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/internals/domain"
)

type purchaseOrderUseCase struct {
	rep rep.PurchaseOrderRepository
}

type PurchaseOrderUseCase interface {
	GetPurchaseOrders(context.Context) ([]domain.PurchaseOrder, error)
	GetPurchaseOrderByID(context.Context, string) (domain.PurchaseOrder, error)
	CreatePurchaseOrder(context.Context, string, string, string, string) (domain.PurchaseOrder, error)
	UpdatePurchaseOrder(context.Context, string, string, string, string, string) (domain.PurchaseOrder, error)
	DestroyPurchaseOrder(context.Context, string) error
	GetPurchaseOrderDetails(context.Context) ([]domain.OrderDetail, error)
	GetPurchaseOrderDetailByID(context.Context, string) (domain.OrderDetail, error)
	GetPurchaseOrderDetailsByYear(context.Context, string) ([]domain.OrderDetail, error)
}

func NewPurchaseOrderUseCase(rep rep.PurchaseOrderRepository) PurchaseOrderUseCase {
	return &purchaseOrderUseCase{rep}
}

// PurchaseOrdersの取得(Gets)
func (p *purchaseOrderUseCase) GetPurchaseOrders(c context.Context) ([]domain.PurchaseOrder, error) {
	purchaseOrder := domain.PurchaseOrder{}
	var purchaseOrders []domain.PurchaseOrder
	rows, err := p.rep.All(c)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		err := rows.Scan(
			&purchaseOrder.ID,
			&purchaseOrder.DeadLine,
			&purchaseOrder.UserID,
			&purchaseOrder.ExpenseID,
			&purchaseOrder.FinanceCheck,
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

// PurchaseOrderの取得(Get)
func (p *purchaseOrderUseCase) GetPurchaseOrderByID(c context.Context, id string) (domain.PurchaseOrder, error) {
	purchaseOrder := domain.PurchaseOrder{}
	row, err := p.rep.Find(c, id)
	err = row.Scan(
		&purchaseOrder.ID,
		&purchaseOrder.DeadLine,
		&purchaseOrder.UserID,
		&purchaseOrder.ExpenseID,
		&purchaseOrder.FinanceCheck,
		&purchaseOrder.CreatedAt,
		&purchaseOrder.UpdatedAt,
	)
	if err != nil {
		return purchaseOrder, err
	}
	return purchaseOrder, nil
}

// PurcahseOrderの作成(create)
func (p *purchaseOrderUseCase) CreatePurchaseOrder(
	c context.Context,
	deadLine string,
	userID string,
	expenseID string,
	finansuCheck string,
) (domain.PurchaseOrder, error) {
	latastPurchaseOrder := domain.PurchaseOrder{}
	p.rep.Create(c, deadLine, userID, expenseID, finansuCheck)
	row, err := p.rep.FindNewRecord(c)
	err = row.Scan(
		&latastPurchaseOrder.ID,
		&latastPurchaseOrder.DeadLine,
		&latastPurchaseOrder.UserID,
		&latastPurchaseOrder.ExpenseID,
		&latastPurchaseOrder.FinanceCheck,
		&latastPurchaseOrder.CreatedAt,
		&latastPurchaseOrder.UpdatedAt,
	)
	if err != nil {
		return latastPurchaseOrder, err
	}
	return latastPurchaseOrder, nil
}

// PurchaseOrderの修正(Update)
func (p *purchaseOrderUseCase) UpdatePurchaseOrder(
	c context.Context,
	id string,
	deadLine string,
	userID string,
	expenseID string,
	finansuCheck string,
) (domain.PurchaseOrder, error) {
	updatedPurchaseOrder := domain.PurchaseOrder{}
	p.rep.Update(c, id, deadLine, userID, expenseID, finansuCheck)
	row, err := p.rep.Find(c, id)
	err = row.Scan(
		&updatedPurchaseOrder.ID,
		&updatedPurchaseOrder.DeadLine,
		&updatedPurchaseOrder.UserID,
		&updatedPurchaseOrder.ExpenseID,
		&updatedPurchaseOrder.FinanceCheck,
		&updatedPurchaseOrder.CreatedAt,
		&updatedPurchaseOrder.UpdatedAt,
	)
	if err != nil {
		return updatedPurchaseOrder, err
	}
	return updatedPurchaseOrder, nil
}

// PurchaseOrderの削除(delete)
func (p *purchaseOrderUseCase) DestroyPurchaseOrder(
	c context.Context,
	id string,
) error {
	err := p.rep.Delete(c, id)
	if err != nil {
		return err
	}
	err = p.rep.DeleteItems(c,id)
	if err != nil {
		return err
	}
	err = p.rep.DeleteReport(c,id)
	return err
}

// Purchase_orderに紐づくUserとItemの取得(All)
func (p *purchaseOrderUseCase) GetPurchaseOrderDetails(c context.Context) ([]domain.OrderDetail, error) {
	orderDetail := domain.OrderDetail{}
	var orderDetails []domain.OrderDetail
	purchaseItem := domain.PurchaseItem{}
	var purchaseItems []domain.PurchaseItem
	rows, err := p.rep.AllUserInfo(c)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		err := rows.Scan(
			&orderDetail.PurchaseOrder.ID,
			&orderDetail.PurchaseOrder.DeadLine,
			&orderDetail.PurchaseOrder.UserID,
			&orderDetail.PurchaseOrder.ExpenseID,
			&orderDetail.PurchaseOrder.FinanceCheck,
			&orderDetail.PurchaseOrder.CreatedAt,
			&orderDetail.PurchaseOrder.UpdatedAt,
			&orderDetail.User.ID,
			&orderDetail.User.Name,
			&orderDetail.User.BureauID,
			&orderDetail.User.RoleID,
			&orderDetail.User.CreatedAt,
			&orderDetail.User.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		rows, err := p.rep.FindPurchaseItem(c, strconv.Itoa(int(orderDetail.PurchaseOrder.ID)))
		for rows.Next() {
			err := rows.Scan(
				&purchaseItem.ID,
				&purchaseItem.Item,
				&purchaseItem.Price,
				&purchaseItem.Quantity,
				&purchaseItem.Detail,
				&purchaseItem.Url,
				&purchaseItem.PurchaseOrderID,
				&purchaseItem.FinanceCheck,
				&purchaseItem.CreatedAt,
				&purchaseItem.UpdatedAt,
			)
			if err != nil {
				return nil, err
			}
			purchaseItems = append(purchaseItems, purchaseItem)
		}
		orderDetail.PurchaseItem = purchaseItems
		orderDetails = append(orderDetails, orderDetail)
		purchaseItems = nil
	}
	return orderDetails, nil
}

// Purchase_orderに紐づくUserとItemの取得(ByID)
func (p *purchaseOrderUseCase) GetPurchaseOrderDetailByID(c context.Context, id string) (domain.OrderDetail, error) {
	orderDetail := domain.OrderDetail{}
	purchaseItem := domain.PurchaseItem{}
	var purchaseItems []domain.PurchaseItem
	row, err := p.rep.FindUserInfo(c, id)
	err = row.Scan(
		&orderDetail.PurchaseOrder.ID,
		&orderDetail.PurchaseOrder.DeadLine,
		&orderDetail.PurchaseOrder.UserID,
		&orderDetail.PurchaseOrder.ExpenseID,
		&orderDetail.PurchaseOrder.FinanceCheck,
		&orderDetail.PurchaseOrder.CreatedAt,
		&orderDetail.PurchaseOrder.UpdatedAt,
		&orderDetail.User.ID,
		&orderDetail.User.Name,
		&orderDetail.User.BureauID,
		&orderDetail.User.RoleID,
		&orderDetail.User.CreatedAt,
		&orderDetail.User.UpdatedAt,
	)
	if err != nil {
		return orderDetail, nil
	}
	rows, err := p.rep.FindPurchaseItem(c, strconv.Itoa(int(orderDetail.PurchaseOrder.ID)))
	for rows.Next() {
		err := rows.Scan(
			&purchaseItem.ID,
			&purchaseItem.Item,
			&purchaseItem.Price,
			&purchaseItem.Quantity,
			&purchaseItem.Detail,
			&purchaseItem.Url,
			&purchaseItem.PurchaseOrderID,
			&purchaseItem.FinanceCheck,
			&purchaseItem.CreatedAt,
			&purchaseItem.UpdatedAt,
		)
		if err != nil {
			return orderDetail, nil
		}
		purchaseItems = append(purchaseItems, purchaseItem)
	}
	orderDetail.PurchaseItem = purchaseItems
	return orderDetail, nil
}

func (p *purchaseOrderUseCase) GetPurchaseOrderDetailsByYear(c context.Context, year string) ([]domain.OrderDetail, error) {
	orderDetail := domain.OrderDetail{}
	var orderDetails []domain.OrderDetail
	purchaseItem := domain.PurchaseItem{}
	var purchaseItems []domain.PurchaseItem
	rows, err := p.rep.AllUserInfoByYear(c, year)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		err := rows.Scan(
			&orderDetail.PurchaseOrder.ID,
			&orderDetail.PurchaseOrder.DeadLine,
			&orderDetail.PurchaseOrder.UserID,
			&orderDetail.PurchaseOrder.ExpenseID,
			&orderDetail.PurchaseOrder.FinanceCheck,
			&orderDetail.PurchaseOrder.CreatedAt,
			&orderDetail.PurchaseOrder.UpdatedAt,
			&orderDetail.User.ID,
			&orderDetail.User.Name,
			&orderDetail.User.BureauID,
			&orderDetail.User.RoleID,
			&orderDetail.User.CreatedAt,
			&orderDetail.User.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		rows, err := p.rep.FindPurchaseItem(c, strconv.Itoa(int(orderDetail.PurchaseOrder.ID)))
		for rows.Next() {
			err := rows.Scan(
				&purchaseItem.ID,
				&purchaseItem.Item,
				&purchaseItem.Price,
				&purchaseItem.Quantity,
				&purchaseItem.Detail,
				&purchaseItem.Url,
				&purchaseItem.PurchaseOrderID,
				&purchaseItem.FinanceCheck,
				&purchaseItem.CreatedAt,
				&purchaseItem.UpdatedAt,
			)
			if err != nil {
				return nil, err
			}
			purchaseItems = append(purchaseItems, purchaseItem)
		}
		orderDetail.PurchaseItem = purchaseItems
		orderDetails = append(orderDetails, orderDetail)
		purchaseItems = nil
	}
	return orderDetails, nil
}
