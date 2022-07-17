package usecase

import (
	"context"
	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/pkg/errors"
)

type purchaseItemUseCase struct {
	rep rep.PurchaseItemRepository
}

type PurchaseItemUseCase interface {
	GetPurchaseItem(context.Context) ([]domain.PurchaseItem, error)
	GetPurchaseItemByID(context.Context, string) (domain.PurchaseItem, error)
	CreatePurchaseItem(context.Context, string, string, string, string, string, string, string) error
	UpdatePurchaseItem(context.Context, string, string, string, string, string, string, string, string) error
	DestroyPurchaseItem(context.Context, string) error
	GetPurchaseItemWithPurchaseOrder(context.Context) ([]domain.PurchaseItemWithOrder, error)
	GetPurchaseItemWithPurchaseOrderByID(context.Context, string) (domain.PurchaseItemWithOrder, error)
}

func NewPurchaseItemUseCase(rep rep.PurchaseItemRepository) PurchaseItemUseCase {
	return &purchaseItemUseCase{rep}
}

//PurchaseItemsの取得(Gets)
func (p *purchaseItemUseCase) GetPurchaseItem(c context.Context) ([]domain.PurchaseItem, error) {
	purchaseItem := domain.PurchaseItem{}
	var purchaseItems []domain.PurchaseItem
	rows, err := p.rep.All(c)
	if err != nil {
		return nil, err
	}
	for rows.Next(){
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
			return nil , err
		}
		purchaseItems = append(purchaseItems, purchaseItem)
	}
	return purchaseItems, nil
}

//purchaseItemの取得(Get)
func(p *purchaseItemUseCase) GetPurchaseItemByID(c context.Context, id string) (domain.PurchaseItem, error){
	purchaseItem := domain.PurchaseItem{}
	row, err := p.rep.Find(c, id)
	err = row.Scan(
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
		return purchaseItem, err
	}
	return purchaseItem, nil
}


//purchaseItemの作成
func(p *purchaseItemUseCase) CreatePurchaseItem(
	c context.Context,
	Item string,
	Price string,
	Quantity string,
	Detail string,
	Url string,
	PurchaseOrderID string,
	FinanceCheck string,
)error {
	err := p.rep.Create(c, Item, Price, Quantity, Detail, Url, PurchaseOrderID, FinanceCheck)
	return err
}

//purchaseItemの修正(Update)
func(p *purchaseItemUseCase) UpdatePurchaseItem(
	c context.Context,
	id string,
	Item string,
	Price string,
	Quantity string,
	Detail string,
	Url string,
	PurchaseOrderID string,
	FinanceCheck string,
)error {
	err := p.rep.Update(c, id, Item, Price, Quantity, Detail, Url, PurchaseOrderID, FinanceCheck)
	return err
}

//purchaseItemの削除(delete)
func(p *purchaseItemUseCase) DestroyPurchaseItem(
	c context.Context,
	id string,
)error {
	err := p.rep.Delete(c, id)
	return err
}

//purchaseOrderに紐づくPurchaseItemの取得(Gets)
func (p *purchaseItemUseCase) GetPurchaseItemWithPurchaseOrder(c context.Context) ([]domain.PurchaseItemWithOrder, error) {

	purchaseItemwithpurchaseorder := domain.PurchaseItemWithOrder{}
	var purchaseItemwithpurchaseorders []domain.PurchaseItemWithOrder

	//クエリ実行
	rows, err := p.rep.AllWithPurchaseOrder(c)
	if err != nil {
		return nil,err
	}
	defer rows.Close()

	for rows.Next(){
		err := rows.Scan(
			&purchaseItemwithpurchaseorder.ID,
			&purchaseItemwithpurchaseorder.Item,
			&purchaseItemwithpurchaseorder.Price,
			&purchaseItemwithpurchaseorder.Quantity,
			&purchaseItemwithpurchaseorder.Detail,
			&purchaseItemwithpurchaseorder.Url,
			&purchaseItemwithpurchaseorder.DeadLine,
			&purchaseItemwithpurchaseorder.Name,
			&purchaseItemwithpurchaseorder.FinanceCheck,
			&purchaseItemwithpurchaseorder.CreatedAt,
			&purchaseItemwithpurchaseorder.UpdatedAt,
		)
		if err != nil {
			return nil, errors.Wrapf(err, "cannot connect SQL")
		}
		purchaseItemwithpurchaseorders = append(purchaseItemwithpurchaseorders, purchaseItemwithpurchaseorder)
	}
	return purchaseItemwithpurchaseorders, nil
}

//purchaseOrderに紐づくPurchaseItemの取得(Get)
func (p *purchaseItemUseCase) GetPurchaseItemWithPurchaseOrderByID(c context.Context, id string) (domain.PurchaseItemWithOrder, error){
	purchaseItemwithpurchaseorder := domain.PurchaseItemWithOrder{}

	row, err := p.rep.FindWithPurchaseOrder(c, id)
	err = row.Scan(
		&purchaseItemwithpurchaseorder.ID,
		&purchaseItemwithpurchaseorder.Item,
		&purchaseItemwithpurchaseorder.Price,
		&purchaseItemwithpurchaseorder.Quantity,
		&purchaseItemwithpurchaseorder.Detail,
		&purchaseItemwithpurchaseorder.Url,
		&purchaseItemwithpurchaseorder.DeadLine,
		&purchaseItemwithpurchaseorder.Name,
		&purchaseItemwithpurchaseorder.FinanceCheck,
		&purchaseItemwithpurchaseorder.CreatedAt,
		&purchaseItemwithpurchaseorder.UpdatedAt,
	)
	if err != nil {
		return purchaseItemwithpurchaseorder, err
	}
	return purchaseItemwithpurchaseorder, nil

}

