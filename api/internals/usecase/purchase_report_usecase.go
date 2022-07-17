package usecase

import (
	"context"
	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	"strconv"
)

type purchaseReportUseCase struct {
	rep rep.PurchaseReportRepository
}

type PurchaseReportUseCase interface {
	GetPurchaseReports(context.Context) ([]domain.PurchaseReport, error)
	GetPurchaseReportByID(context.Context, string) (domain.PurchaseReport, error)
	CreatePurchaseReport(context.Context, string, string) error
	UpdatePurchaseReport(context.Context, string, string, string) error
	DestroyPurchaseReport(context.Context, string) error
	GetPurchaseReportsWithOrderItem(context.Context) ([]domain.PurchaseReportWithOrderItem, error)
	GetPurchaseReportWithOrderItemByID(context.Context, string) (domain.PurchaseReportWithOrderItem, error)
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
	UserID string,
	PurchaseOrderID string,
) error {
	err := p.rep.Create(c, UserID, PurchaseOrderID)
	return err
}

//PurchaseReportの修正(update)
func (p *purchaseReportUseCase) UpdatePurchaseReport(
	c context.Context,
	id string,
	UserID string,
	PurchaseOrderID string,
) error {
	err := p.rep.Update(c, id, UserID, PurchaseOrderID)
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

//Purchase_reportに紐づく、Purchase_orderからPurchase_itemsの取得(GETS)
func (p *purchaseReportUseCase) GetPurchaseReportsWithOrderItem(c context.Context) ([]domain.PurchaseReportWithOrderItem, error) {
	purchaseReportwithorderitem := domain.PurchaseReportWithOrderItem{}
	var purchaseReportwithorderitems []domain.PurchaseReportWithOrderItem
	purchaseItem := domain.PurchaseItem{}
	var purchaseItems []domain.PurchaseItem
	rows, err := p.rep.AllWithOrderItem(c)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		err := rows.Scan(
			&purchaseReportwithorderitem.PurchaseReport.ID,
			&purchaseReportwithorderitem.PurchaseReport.UserID,
			&purchaseReportwithorderitem.PurchaseReport.PurchaseOrderID,
			&purchaseReportwithorderitem.PurchaseReport.CreatedAt,
			&purchaseReportwithorderitem.PurchaseReport.UpdatedAt,
			&purchaseReportwithorderitem.ReportUser.ID,
			&purchaseReportwithorderitem.ReportUser.Name,
			&purchaseReportwithorderitem.ReportUser.BureauID,
			&purchaseReportwithorderitem.ReportUser.RoleID,
			&purchaseReportwithorderitem.ReportUser.CreatedAt,
			&purchaseReportwithorderitem.ReportUser.UpdatedAt,
			&purchaseReportwithorderitem.PurchaseOrder.ID,
			&purchaseReportwithorderitem.PurchaseOrder.DeadLine,
			&purchaseReportwithorderitem.PurchaseOrder.UserID,
			&purchaseReportwithorderitem.PurchaseOrder.CreatedAt,
			&purchaseReportwithorderitem.PurchaseOrder.UpdatedAt,
			&purchaseReportwithorderitem.OrderUser.ID,
			&purchaseReportwithorderitem.OrderUser.Name,
			&purchaseReportwithorderitem.OrderUser.BureauID,
			&purchaseReportwithorderitem.OrderUser.RoleID,
			&purchaseReportwithorderitem.OrderUser.CreatedAt,
			&purchaseReportwithorderitem.OrderUser.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		rows, err := p.rep.GetPurchaseItemByPurchaseOrderID(c, strconv.Itoa(int(purchaseReportwithorderitem.PurchaseReport.PurchaseOrderID)))
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
		purchaseReportwithorderitem.PurchaseItems = purchaseItems
		purchaseReportwithorderitems = append(purchaseReportwithorderitems, purchaseReportwithorderitem)
		purchaseItems = nil
	}
	return purchaseReportwithorderitems, nil
}

//idで選択しPurchase_reportに紐づく、Purchase_orderからPurchase_itemsの取得(GETS)
func (p *purchaseReportUseCase) GetPurchaseReportWithOrderItemByID(c context.Context, id string) (domain.PurchaseReportWithOrderItem, error) {
	purchaseReportwithorderitem := domain.PurchaseReportWithOrderItem{}
	purchaseItem := domain.PurchaseItem{}
	var purchaseItems []domain.PurchaseItem
	row, err := p.rep.FindWithOrderItem(c, id)
	err = row.Scan(
		&purchaseReportwithorderitem.PurchaseReport.ID,
		&purchaseReportwithorderitem.PurchaseReport.UserID,
		&purchaseReportwithorderitem.PurchaseReport.PurchaseOrderID,
		&purchaseReportwithorderitem.PurchaseReport.CreatedAt,
		&purchaseReportwithorderitem.PurchaseReport.UpdatedAt,
		&purchaseReportwithorderitem.ReportUser.ID,
		&purchaseReportwithorderitem.ReportUser.Name,
		&purchaseReportwithorderitem.ReportUser.BureauID,
		&purchaseReportwithorderitem.ReportUser.RoleID,
		&purchaseReportwithorderitem.ReportUser.CreatedAt,
		&purchaseReportwithorderitem.ReportUser.UpdatedAt,
		&purchaseReportwithorderitem.PurchaseOrder.ID,
		&purchaseReportwithorderitem.PurchaseOrder.DeadLine,
		&purchaseReportwithorderitem.PurchaseOrder.UserID,
		&purchaseReportwithorderitem.PurchaseOrder.CreatedAt,
		&purchaseReportwithorderitem.PurchaseOrder.UpdatedAt,
		&purchaseReportwithorderitem.OrderUser.ID,
		&purchaseReportwithorderitem.OrderUser.Name,
		&purchaseReportwithorderitem.OrderUser.BureauID,
		&purchaseReportwithorderitem.OrderUser.RoleID,
		&purchaseReportwithorderitem.OrderUser.CreatedAt,
		&purchaseReportwithorderitem.OrderUser.UpdatedAt,
	)
	if err != nil {
		return purchaseReportwithorderitem, err
	}
	rows, err := p.rep.GetPurchaseItemByPurchaseOrderID(c, strconv.Itoa(int(purchaseReportwithorderitem.PurchaseReport.PurchaseOrderID)))
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
			return purchaseReportwithorderitem, err
		}
		purchaseItems = append(purchaseItems, purchaseItem)
	}
	purchaseReportwithorderitem.PurchaseItems = purchaseItems
	return purchaseReportwithorderitem, nil
}
