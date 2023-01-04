package repository

import (
	"context"
	"database/sql"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
)

type purchaseReportRepository struct {
	client   db.Client
	abstract abstract.Crud
}

type PurchaseReportRepository interface {
	All(context.Context) (*sql.Rows, error)
	Find(context.Context, string) (*sql.Row, error)
	Create(context.Context, string, string, string, string, string, string) error
	Update(context.Context, string, string, string, string, string, string, string) error
	Delete(context.Context, string) error
	AllWithOrderItem(context.Context) (*sql.Rows, error)
	FindWithOrderItem(context.Context, string) (*sql.Row, error)
	GetPurchaseItemByPurchaseOrderID(context.Context, string) (*sql.Rows, error)
	FindNewRecord(context.Context) (*sql.Row, error)
}

func NewPurchaseReportRepository(c db.Client, ac abstract.Crud) PurchaseReportRepository {
	return &purchaseReportRepository{c, ac}
}

// 全件取得
func (prr *purchaseReportRepository) All(c context.Context) (*sql.Rows, error) {
	query := "select * from purchase_reports"
	return prr.abstract.Read(c, query)
}

// 1件取得
func (prr *purchaseReportRepository) Find(c context.Context, id string) (*sql.Row, error) {
	query := "select * from purchase_reports where id =" + id
	return prr.abstract.ReadByID(c, query)
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
) error {
	var query = "insert into purchase_reports (user_id, discount, addition, finance_check, purchase_order_id, remark) values (" + userId + "," + discount + "," + addition + "," + finance_check + "," + purchaseOrderId + ",'" + remark + "')"
	return ppr.abstract.UpdateDB(c, query)
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
) error {
	var query = "update purchase_reports set user_id =" + userId + ", discount =" + discount + ",addition =" + addition + ", finance_check =" + finance_check + ", purchase_order_id =" + purchaseOrderId + ", remark ='" + remark + "' where id = " + id
	return ppr.abstract.UpdateDB(c, query)
}

// 削除
func (ppr *purchaseReportRepository) Delete(
	c context.Context,
	id string,
) error {
	query := "Delete from purchase_reports where id =" + id
	return ppr.abstract.UpdateDB(c, query)
}

// Purchase_reportに紐づく、Purchase_orderからPurchase_itemsの取得
func (ppr *purchaseReportRepository) AllWithOrderItem(c context.Context) (*sql.Rows, error) {
	query := "select * from purchase_reports inner join users as report_user on purchase_reports.user_id = report_user.id inner join purchase_orders on purchase_reports.purchase_order_id = purchase_orders.id inner join users as order_user on purchase_orders.user_id = order_user.id"
	return ppr.abstract.Read(c, query)
}

// idで選択しPurchase_reportに紐づく、Purchase_orderからPurchase_itemsの取得
func (ppr *purchaseReportRepository) FindWithOrderItem(c context.Context, id string) (*sql.Row, error) {
	query := "select * from purchase_reports inner join users as report_user on purchase_reports.user_id = report_user.id inner join purchase_orders on purchase_reports.purchase_order_id = purchase_orders.id inner join users as order_user on purchase_orders.user_id = order_user.id where purchase_reports.id = " + id
	return ppr.abstract.ReadByID(c, query)
}

// purchase_order_idに紐づいたpuchase_itemの取得
func (ppr *purchaseReportRepository) GetPurchaseItemByPurchaseOrderID(c context.Context, purchaseOrderID string) (*sql.Rows, error) {
	query := "select * from purchase_items where purchase_order_id = " + purchaseOrderID
	return ppr.abstract.Read(c, query)
}

// purchasereportの最新のレコード取得
func (ppr *purchaseReportRepository) FindNewRecord(c context.Context) (*sql.Row, error) {
	query := "select * from purchase_reports order by id desc limit 1"
	return ppr.abstract.ReadByID(c, query)
}
