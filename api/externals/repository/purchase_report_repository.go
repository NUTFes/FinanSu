package repository

import (
	"context"
	"database/sql"
	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/pkg/errors"
	"fmt"
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
	FindWithOrderItem(context.Context, string) (*sql.Row, error)
}

func NewPurchaseReportRepository(client db.Client) PurchaseReportRepository {
	return &purchaseReportRepository{client}
}

//全件取得
func (prr *purchaseReportRepository) All(c context.Context) (*sql.Rows, error) {
	query := "select * from purchase_reports"
	rows , err := prr.client.DB().QueryContext(c, query)
	if err != nil {
		return nil, errors.Wrapf(err, "cannot connenct SQL")
	}
	fmt.Printf("\x1b[36m%s\n", query)
	return rows, nil
}

//1件取得
func (prr *purchaseReportRepository) Find(c context.Context, id string) (*sql.Row, error) {
	query := "select * from purchase_reports where id =" + id
	row := prr.client.DB().QueryRowContext(c, query)
	fmt.Printf("\x1b[36m%s\n", query)
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
	fmt.Printf("\x1b[36m%s\n", query)
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
	fmt.Printf("\x1b[36m%s\n", query)
	return err
}

//削除
func (ppr *purchaseReportRepository) Delete(
	c context.Context,
	id string,
)error {
	query := "Delete from purchase_reports where id =" + id
	_, err := ppr.client.DB().ExecContext(c, query)
	fmt.Printf("\x1b[36m%s\n", query)
	return err
}

//Purchase_reportに紐づく、Purchase_orderからPurchase_itemsの取得
func (ppr *purchaseReportRepository) AllWithOrderItem(c context.Context) (*sql.Rows, error) {
	query := "select * from purchase_reports inner join users as report_user on purchase_reports.user_id = report_user.id inner join purchase_orders on purchase_reports.purchase_order_id = purchase_orders.id inner join users as order_user on purchase_orders.user_id = order_user.id;"
	rows, err := ppr.client.DB().QueryContext(c, query)
	if err != nil {
		return nil, errors.Wrapf(err, "cannot connect SQL")
	}
	fmt.Printf("\x1b[36m%s\n", query)
	return rows, nil
}

//idで選択しPurchase_reportに紐づく、Purchase_orderからPurchase_itemsの取得
func (ppr *purchaseReportRepository) FindWithOrderItem(c context.Context, id string) (*sql.Row, error) {
	query := "SELECT purchase_reports.id, users.name, purchase_items.item, purchase_items.price, purchase_items.quantity, purchase_items.detail, purchase_items.url, purchase_items.finansu_check, purchase_orders.deadline, purchase_reports.created_at, purchase_reports.updated_at FROM purchase_reports INNER JOIN users ON purchase_reports.user_id =users.id INNER JOIN  purchase_items ON purchase_reports.purchase_order_id = purchase_items.purchase_order_id INNER JOIN purchase_orders ON purchase_reports.purchase_order_id = purchase_orders.id where purchase_reports.id =" +id
	row := ppr.client.DB().QueryRowContext(c, query)
	fmt.Printf("\x1b[36m%s\n", query)
	return row, nil
}

