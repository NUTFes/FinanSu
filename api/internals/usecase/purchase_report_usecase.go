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
	CreatePurchaseReport(context.Context, string, string, string, string, string,string) (domain.PurchaseReport, error)
	UpdatePurchaseReport(context.Context, string, string, string, string, string, string,string) (domain.PurchaseReport, error)
	DestroyPurchaseReport(context.Context, string) error
	GetPurchaseReportDetails(context.Context) ([]domain.PurchaseReportDetails, error)
	GetPurchaseReportDetailByID(context.Context, string) (domain.PurchaseReportDetails, error)
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
			&purchaseReport.Discount,
			&purchaseReport.Addition,
			&purchaseReport.FinanceCheck,
			&purchaseReport.PurchaseOrderID,
			&purchaseReport.Remark,
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
		&purchaseReport.Discount,
		&purchaseReport.Addition,
		&purchaseReport.FinanceCheck,
		&purchaseReport.PurchaseOrderID,
		&purchaseReport.Remark,
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
	Discount string,
	Addition string,
	FinanceCheck string,
	PurchaseOrderID string,
	Remark string,
) (domain.PurchaseReport, error) {
	p.rep.Create(c, UserID ,Discount, Addition, FinanceCheck, PurchaseOrderID,Remark)
	latastPurchaseReport := domain.PurchaseReport{}
	row, err := p.rep.FindNewRecord(c)
	err = row.Scan(
		&latastPurchaseReport.ID,
		&latastPurchaseReport.UserID,
		&latastPurchaseReport.Discount,
		&latastPurchaseReport.Addition,
		&latastPurchaseReport.FinanceCheck,
		&latastPurchaseReport.PurchaseOrderID,
		&latastPurchaseReport.Remark,
		&latastPurchaseReport.CreatedAt,
		&latastPurchaseReport.UpdatedAt,
	)
	if err != nil {
		return latastPurchaseReport, err
	}
	return latastPurchaseReport, nil
}

//PurchaseReportの修正(update)
func (p *purchaseReportUseCase) UpdatePurchaseReport(
	c context.Context,
	id string,
	UserID string,
	Discount string,
	Addition string,
	FinanceCheck string,
	PurchaseOrderID string,
	Remark string,
) (domain.PurchaseReport, error) {
	p.rep.Update(c,id, UserID, Discount, Addition, FinanceCheck, PurchaseOrderID, Remark)
	updatedPurchaseReport := domain.PurchaseReport{}
	row, err := p.rep.Find(c, id)
	err = row.Scan(
		&updatedPurchaseReport.ID,
		&updatedPurchaseReport.UserID,
		&updatedPurchaseReport.Discount,
		&updatedPurchaseReport.Addition,
		&updatedPurchaseReport.FinanceCheck,
		&updatedPurchaseReport.PurchaseOrderID,
		&updatedPurchaseReport.Remark,
		&updatedPurchaseReport.CreatedAt,
		&updatedPurchaseReport.UpdatedAt,
	)
	if err != nil {
		return updatedPurchaseReport, err
	}
	return updatedPurchaseReport, nil
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
func (p *purchaseReportUseCase) GetPurchaseReportDetails(c context.Context) ([]domain.PurchaseReportDetails, error) {
	purchaseReportDetail:= domain.PurchaseReportDetails{}
	var purchaseReportDetails []domain.PurchaseReportDetails
	purchaseItem := domain.PurchaseItem{}
	var purchaseItems []domain.PurchaseItem
	rows, err := p.rep.AllDetails(c)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		err := rows.Scan(
			&purchaseReportDetail.PurchaseReport.ID,
			&purchaseReportDetail.PurchaseReport.UserID,
			&purchaseReportDetail.PurchaseReport.Discount,
			&purchaseReportDetail.PurchaseReport.Addition,
			&purchaseReportDetail.PurchaseReport.FinanceCheck,
			&purchaseReportDetail.PurchaseReport.PurchaseOrderID,
			&purchaseReportDetail.PurchaseReport.Remark,
			&purchaseReportDetail.PurchaseReport.CreatedAt,
			&purchaseReportDetail.PurchaseReport.UpdatedAt,
			&purchaseReportDetail.ReportUser.ID,
			&purchaseReportDetail.ReportUser.Name,
			&purchaseReportDetail.ReportUser.BureauID,
			&purchaseReportDetail.ReportUser.RoleID,
			&purchaseReportDetail.ReportUser.CreatedAt,
			&purchaseReportDetail.ReportUser.UpdatedAt,
			&purchaseReportDetail.PurchaseOrder.ID,
			&purchaseReportDetail.PurchaseOrder.DeadLine,
			&purchaseReportDetail.PurchaseOrder.UserID,
			&purchaseReportDetail.PurchaseOrder.FinanceCheck,
			&purchaseReportDetail.PurchaseOrder.CreatedAt,
			&purchaseReportDetail.PurchaseOrder.UpdatedAt,
			&purchaseReportDetail.OrderUser.ID,
			&purchaseReportDetail.OrderUser.Name,
			&purchaseReportDetail.OrderUser.BureauID,
			&purchaseReportDetail.OrderUser.RoleID,
			&purchaseReportDetail.OrderUser.CreatedAt,
			&purchaseReportDetail.OrderUser.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		rows, err := p.rep.AllItemInfo(c, strconv.Itoa(int(purchaseReportDetail.PurchaseReport.PurchaseOrderID)))
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
		purchaseReportDetail.PurchaseItems = purchaseItems
		purchaseReportDetails = append(purchaseReportDetails, purchaseReportDetail)
		purchaseItems = nil
	}
	return purchaseReportDetails, nil
}

//idで選択しPurchase_reportに紐づく、Purchase_orderからPurchase_itemsの取得(GETS)
func (p *purchaseReportUseCase) GetPurchaseReportDetailByID(c context.Context, id string) (domain.PurchaseReportDetails, error) {
	purchaseReportDetail := domain.PurchaseReportDetails{}
	purchaseItem := domain.PurchaseItem{}
	var purchaseItems []domain.PurchaseItem
	row, err := p.rep.FindDetail(c, id)
	err = row.Scan(
		&purchaseReportDetail.PurchaseReport.ID,
		&purchaseReportDetail.PurchaseReport.UserID,
		&purchaseReportDetail.PurchaseReport.Discount,
		&purchaseReportDetail.PurchaseReport.Addition,
		&purchaseReportDetail.PurchaseReport.FinanceCheck,
		&purchaseReportDetail.PurchaseReport.PurchaseOrderID,
		&purchaseReportDetail.PurchaseReport.Remark,
		&purchaseReportDetail.PurchaseReport.CreatedAt,
		&purchaseReportDetail.PurchaseReport.UpdatedAt,
		&purchaseReportDetail.ReportUser.ID,
		&purchaseReportDetail.ReportUser.Name,
		&purchaseReportDetail.ReportUser.BureauID,
		&purchaseReportDetail.ReportUser.RoleID,
		&purchaseReportDetail.ReportUser.CreatedAt,
		&purchaseReportDetail.ReportUser.UpdatedAt,
		&purchaseReportDetail.PurchaseOrder.ID,
		&purchaseReportDetail.PurchaseOrder.DeadLine,
		&purchaseReportDetail.PurchaseOrder.UserID,
		&purchaseReportDetail.PurchaseOrder.FinanceCheck,
		&purchaseReportDetail.PurchaseOrder.CreatedAt,
		&purchaseReportDetail.PurchaseOrder.UpdatedAt,
		&purchaseReportDetail.OrderUser.ID,
		&purchaseReportDetail.OrderUser.Name,
		&purchaseReportDetail.OrderUser.BureauID,
		&purchaseReportDetail.OrderUser.RoleID,
		&purchaseReportDetail.OrderUser.CreatedAt,
		&purchaseReportDetail.OrderUser.UpdatedAt,
	)
	if err != nil {
		return purchaseReportDetail, err
	}
	rows, err := p.rep.AllItemInfo(c, strconv.Itoa(int(purchaseReportDetail.PurchaseReport.PurchaseOrderID)))
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
			return purchaseReportDetail, err
		}
		purchaseItems = append(purchaseItems, purchaseItem)
	}
	purchaseReportDetail.PurchaseItems = purchaseItems
	return purchaseReportDetail, nil
}

