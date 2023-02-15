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
	CreatePurchaseItem(context.Context, string, string, string, string, string, string, string) (domain.PurchaseItem, error)
	UpdatePurchaseItem(context.Context, string, string, string, string, string, string, string, string) (domain.PurchaseItem, error)
	DestroyPurchaseItem(context.Context, string) error
	GetPurchaseItemDetails(context.Context) ([]domain.PurchaseItemDetails, error)
	GetPurchaseItemDetailsByID(context.Context, string) (domain.PurchaseItemDetails, error)
}

func NewPurchaseItemUseCase(rep rep.PurchaseItemRepository) PurchaseItemUseCase {
	return &purchaseItemUseCase{rep}
}

// PurchaseItemsの取得(Gets)
func (p *purchaseItemUseCase) GetPurchaseItem(c context.Context) ([]domain.PurchaseItem, error) {
	purchaseItem := domain.PurchaseItem{}
	var purchaseItems []domain.PurchaseItem
	rows, err := p.rep.All(c)
	if err != nil {
		return nil, err
	}
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
	return purchaseItems, nil
}

// purchaseItemの取得(Get)
func (p *purchaseItemUseCase) GetPurchaseItemByID(c context.Context, id string) (domain.PurchaseItem, error) {
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

// purchaseItemの作成
func (p *purchaseItemUseCase) CreatePurchaseItem(
	c context.Context,
	Item string,
	Price string,
	Quantity string,
	Detail string,
	Url string,
	PurchaseOrderID string,
	FinanceCheck string,
) (domain.PurchaseItem, error) {
	latastPurchaseItem := domain.PurchaseItem{}

	err := p.rep.Create(c, Item, Price, Quantity, Detail, Url, PurchaseOrderID, FinanceCheck)
	row, err := p.rep.FindNewRecord(c)
	err = row.Scan(
		&latastPurchaseItem.ID,
		&latastPurchaseItem.Item,
		&latastPurchaseItem.Price,
		&latastPurchaseItem.Quantity,
		&latastPurchaseItem.Detail,
		&latastPurchaseItem.Url,
		&latastPurchaseItem.PurchaseOrderID,
		&latastPurchaseItem.FinanceCheck,
		&latastPurchaseItem.CreatedAt,
		&latastPurchaseItem.UpdatedAt,
	)
	if err != nil {
		return latastPurchaseItem, err
	}
	return latastPurchaseItem, err
}

// purchaseItemの修正(Update)
func (p *purchaseItemUseCase) UpdatePurchaseItem(
	c context.Context,
	id string,
	Item string,
	Price string,
	Quantity string,
	Detail string,
	Url string,
	PurchaseOrderID string,
	FinanceCheck string,
) (domain.PurchaseItem, error) {
	updatedPurchaseItem := domain.PurchaseItem{}
	err := p.rep.Update(c, id, Item, Price, Quantity, Detail, Url, PurchaseOrderID, FinanceCheck)
	row, err := p.rep.Find(c, id)
	err = row.Scan(
		&updatedPurchaseItem.ID,
		&updatedPurchaseItem.Item,
		&updatedPurchaseItem.Price,
		&updatedPurchaseItem.Quantity,
		&updatedPurchaseItem.Detail,
		&updatedPurchaseItem.Url,
		&updatedPurchaseItem.PurchaseOrderID,
		&updatedPurchaseItem.FinanceCheck,
		&updatedPurchaseItem.CreatedAt,
		&updatedPurchaseItem.UpdatedAt,
	)
	if err != nil {
		return updatedPurchaseItem, err
	}
	return updatedPurchaseItem, err
}

// purchaseItemの削除(delete)
func (p *purchaseItemUseCase) DestroyPurchaseItem(
	c context.Context,
	id string,
) error {
	err := p.rep.Delete(c, id)
	return err
}

// purchaseOrderに紐づくPurchaseItemの取得(Gets)
func (p *purchaseItemUseCase) GetPurchaseItemDetails(c context.Context) ([]domain.PurchaseItemDetails, error) {

	purchaseItemwithpurchaseorder := domain.PurchaseItemDetails{}
	var purchaseItemwithpurchaseorders []domain.PurchaseItemDetails

	//クエリ実行
	rows, err := p.rep.AllDetails(c)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
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

// purchaseOrderに紐づくPurchaseItemの取得(Get)
func (p *purchaseItemUseCase) GetPurchaseItemDetailsByID(c context.Context, id string) (domain.PurchaseItemDetails, error) {
	purchaseItemwithpurchaseorder := domain.PurchaseItemDetails{}

	row, err := p.rep.FindDetails(c, id)
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
