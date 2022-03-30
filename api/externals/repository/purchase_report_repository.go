package repository

import (
	"context"
	"database/sql"
	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/pkg/errors"
)

type purchaseReportRepository struct {
	client db.Client
}

type PurchaseReportRepository interface {
	All(context.Context) (*sql.Rows, error)
	Find(context.Context, string) (*sql.Row, error)
	Create(context.Context, string, string) error
	Update(context.Context, string, string, string) error
	Delete(context.Context, string) error
	AllWithOrderItem(context.Context) (*sql.Rows, error)
}

func NewPurchaseReportRepository(client db.Client) PurchaseReportRepository {
	return &purchaseReportRepository{client}
}

//全件取得
func (prr *purchaseReportRepository) All(c context.Context) (*sql.Rows, error) {
	rows , err := prr.client.DB().QueryContext(c, "select * from purchase_reports")
	if err != nil {
		return nil, errors.Wrapf(err, "cannot connenct SQL")
	}
	return rows, nil
}

//1件取得
func (prr *purchaseReportRepository) Find(c context.Context, id string) (*sql.Row, error) {
	row := prr.client.DB().QueryRowContext(c, "select * from purchase_reports where id =" + id)
	return row, nil 
}

//作成
func (ppr *purchaseReportRepository) Create(
	c context.Context,
	userId string,
	purchaseOrderId string,
) error {
	var query = "insert into purchase_reports (user_id, purchase_order_id) values (" + userId  + "," + purchaseOrderId + ")"   
	_, err := ppr.client.DB().ExecContext(c, query)
	return err
}

//編集
func (ppr *purchaseReportRepository) Update(
	c context.Context,
	id string,
	userId string,
	purchaseOrderId string,
)error {
	var query = "update purchase_reports set user_id =" + userId + ", purchase_order_id =" + purchaseOrderId + " where id = " + id
	_, err := ppr.client.DB().ExecContext(c, query) 
	return err
}

//削除
func (ppr *purchaseReportRepository) Delete(
	c context.Context,
	id string,
)error {
	_, err := ppr.client.DB().ExecContext(c, "Delete from purchase_reports where id =" + id)
	return err
}

//Purchase_reportに紐づく、Purchase_orderからPurchase_itemsの取得
func (ppr *purchaseReportRepository) AllWithOrderItem(c context.Context) (*sql.Rows, error) {
	rows, err := ppr.client.DB().QueryContext(c, "SELECT purchase_reports.id, users.name, purchase_items.item, purchase_items.price, purchase_items.quantity, purchase_items.detail, purchase_items.url, purchase_items.finansu_check, purchase_orders.deadline, purchase_reports.created_at, purchase_reports.updated_at FROM purchase_reports INNER JOIN users ON purchase_reports.user_id =users.id INNER JOIN  purchase_items ON purchase_reports.purchase_order_id = purchase_items.purchase_order_id INNER JOIN purchase_orders ON purchase_reports.purchase_order_id = purchase_orders.id ;")
	if err != nil {
		return nil, errors.Wrapf(err, "cannot connect SQL")
	}
	return rows, nil
}