package repository

import (
	"context"
	"database/sql"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
)

type purchaseReportRepository struct {
	client db.Client
	crud   abstract.Crud
}

type PurchaseReportRepository interface {
	All(context.Context) (*sql.Rows, error)
	Find(context.Context, string) (*sql.Row, error)
	Create(context.Context, string, string, string, string, string, string, string) error
	Update(context.Context, string, string, string, string, string, string, string, string) error
	Delete(context.Context, string) error
	AllDetails(context.Context) (*sql.Rows, error)
	FindDetail(context.Context, string) (*sql.Row, error)
	AllItemInfo(context.Context, string) (*sql.Rows, error)
	FindNewRecord(context.Context) (*sql.Row, error)
	AllDetailsForPeriods(context.Context, string) (*sql.Rows, error)
}

func NewPurchaseReportRepository(c db.Client, ac abstract.Crud) PurchaseReportRepository {
	return &purchaseReportRepository{c, ac}
}

// 全件取得
func (prr *purchaseReportRepository) All(c context.Context) (*sql.Rows, error) {
	query := "SELECT * FROM purchase_reports"
	return prr.crud.Read(c, query)
}

// 1件取得
func (prr *purchaseReportRepository) Find(c context.Context, id string) (*sql.Row, error) {
	query := "SELECT * FROM purchase_reports WHERE id =" + id
	return prr.crud.ReadByID(c, query)
}

// 作成
func (ppr *purchaseReportRepository) Create(
	c context.Context,
	userId string,
	discount string,
	addition string,
	finance_check string,
	purchaseOrderId string,
	remark string,
	buyer string,
) error {
	query := `
		INSERT INTO
			purchase_reports (user_id, discount, addition, finance_check, purchase_order_id, remark, buyer)
		VALUES (` + userId + "," + discount + "," + addition + "," + finance_check + "," + purchaseOrderId + ",'" + remark + "','" + buyer + "')"
	return ppr.crud.UpdateDB(c, query)
}

// 編集
func (ppr *purchaseReportRepository) Update(
	c context.Context,
	id string,
	userId string,
	discount string,
	addition string,
	finance_check string,
	purchaseOrderId string,
	remark string,
	buyer string,
) error {
	query := `
		UPDATE
			purchase_reports
		SET
			user_id =` + userId +
		", discount =" + discount +
		", addition =" + addition +
		", finance_check =" + finance_check +
		", purchase_order_id =" + purchaseOrderId +
		", remark ='" + remark +
		"', buyer ='" + buyer +
		"' WHERE id = " + id
	return ppr.crud.UpdateDB(c, query)
}

// 削除
func (ppr *purchaseReportRepository) Delete(
	c context.Context,
	id string,
) error {
	query := "DELETE FROM purchase_reports WHERE id =" + id
	return ppr.crud.UpdateDB(c, query)
}

// Purchase_reportに紐づく、Purchase_orderからPurchase_itemsの取得
func (ppr *purchaseReportRepository) AllDetails(c context.Context) (*sql.Rows, error) {
	query := `
		SELECT
			*
		FROM
			purchase_reports
		INNER JOIN
			users
		AS
			report_user
		ON
			purchase_reports.user_id = report_user.id
		INNER JOIN
			purchase_orders
		ON
			purchase_reports.purchase_order_id = purchase_orders.id
		INNER JOIN
			users
		AS
			order_user
		ON
			purchase_orders.user_id = order_user.id`
	return ppr.crud.Read(c, query)
}

// idで選択しPurchase_reportに紐づく、Purchase_orderからPurchase_itemsの取得
func (ppr *purchaseReportRepository) FindDetail(c context.Context, id string) (*sql.Row, error) {
	query := `
		SELECT
			*
		FROM
			purchase_reports
		INNER JOIN
			users
		AS
			report_user
		ON
			purchase_reports.user_id = report_user.id
		INNER JOIN
			purchase_orders
		ON
			purchase_reports.purchase_order_id = purchase_orders.id
		INNER JOIN
			users
		AS
			order_user
		ON
			purchase_orders.user_id = order_user.id
		WHERE purchase_reports.id = ` + id
	return ppr.crud.ReadByID(c, query)
}

// purchase_order_idに紐づいたpuchase_itemの取得
func (ppr *purchaseReportRepository) AllItemInfo(c context.Context, purchaseOrderID string) (*sql.Rows, error) {
	query := "SELECT * FROM purchase_items WHERE purchase_order_id = " + purchaseOrderID
	return ppr.crud.Read(c, query)
}

// purchasereportの最新のレコード取得
func (ppr *purchaseReportRepository) FindNewRecord(c context.Context) (*sql.Row, error) {
	query := "SELECT * FROM purchase_reports ORDER BY id DESC LIMIT 1"
	return ppr.crud.ReadByID(c, query)
}


// Purchase_reportに紐づく、Purchase_orderからPurchase_itemsの取得
func (ppr *purchaseReportRepository) AllDetailsForPeriods(c context.Context, year string) (*sql.Rows, error) {
	query := `
		SELECT
			purchase_reports.*,
			report_user.*,
			purchase_orders.*,
			order_user.*
		FROM
			purchase_reports
		INNER JOIN
			users
		AS
			report_user
		ON
			purchase_reports.user_id = report_user.id
		INNER JOIN
			purchase_orders
		ON
			purchase_reports.purchase_order_id = purchase_orders.id
		INNER JOIN
			users
		AS
			order_user
		ON
			purchase_orders.user_id = order_user.id
		INNER JOIN
			year_periods
		ON
			purchase_reports.created_at > year_periods.started_at
		AND
			purchase_reports.created_at < year_periods.ended_at
		INNER JOIN
			years
		ON
			year_periods.year_id = years.id
		WHERE
			years.year = ` + year +
			" ORDER BY purchase_reports.id"
	return ppr.crud.Read(c, query)
}
