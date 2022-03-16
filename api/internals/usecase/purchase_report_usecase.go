package usecase

import (
	"context"
	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/internals/domain"
)

type purchaseReportUseCase struct {
	rep rep.PurchaseReportRepository
}

type PurchaseReportUseCase interface {
	GetPurchaseReports(context.Context) ([]domain.PurchaseReport, error)
	GetPurchaseReportByID(context.Context, string) (domain.PurchaseReport, error)
	CreatePurchaseReport(context.Context, string, string, string, string) error
	UpdatePurchaseReport(context.Context, string, string, string, string, string) error
	DestroyPurchaseReport(context.Context, string) error
}

func NewPurchaseReportUseCase(rep rep.PurchaseReportRepository) PurchaseReportUseCase {
	return &purchaseReportUseCase{rep}
}

//PurchaseReportsの取得(Gets)
func (p *purchaseReportUseCase) GetPurchaseReports(c context.Context) ([]domain.PurchaseReport, error) {
	purchaseReport := domain.PurchaseReport{}
	var purchaseReports []domain.PurchaseReport
	rows, err := p.rep.All(c)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		err := rows.Scan(
			&purchaseReport.ID,
			&purchaseReport.Item,
			&purchaseReport.Price,
			&purchaseReport.UserID,
			&purchaseReport.PurchaseOrderID,
			&purchaseReport.CreatedAt,
			&purchaseReport.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		purchaseReports = append(purchaseReports, purchaseReport)
	}
	return purchaseReports, nil
}

//purchaseReportの取得(Get)
func (p *purchaseReportUseCase) GetPurchaseReportByID(c context.Context, id string) (domain.PurchaseReport, error) {
	purchaseReport := domain.PurchaseReport{}
	row, err := p.rep.Find(c, id)
	err = row.Scan(
		&purchaseReport.ID,
		&purchaseReport.Item,
		&purchaseReport.Price,
		&purchaseReport.UserID,
		&purchaseReport.PurchaseOrderID,
		&purchaseReport.CreatedAt,
		&purchaseReport.UpdatedAt,
	)
	if err != nil {
		return purchaseReport, err
	}
	return purchaseReport, nil
}

//PurchaseReportの作成(create)
func (p *purchaseReportUseCase) CreatePurchaseReport(
	c context.Context,
	Item string,
	Price string,
	UserID string,
	PurchaseOrderID string,
) error {
	err := p.rep.Create(c, Item, Price, UserID, PurchaseOrderID)
	return err
}

//PurchaseReportの修正(update)
func (p *purchaseReportUseCase) UpdatePurchaseReport(
	c context.Context,
	id string,
	Item string,
	Price string,
	UserID string,
	PurchaseOrderID string,
) error {
	err := p.rep.Update(c, id, Item, Price, UserID, PurchaseOrderID)
	return err
}

//PurchaseReportの削除(delate)
func (p *purchaseReportUseCase) DestroyPurchaseReport(
	c context.Context,
	id string,
) error {
	err := p.rep.Delete(c, id)
	return err
}

