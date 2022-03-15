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
	Create(context.Context, string, string, string, string) error
	Update(context.Context, string, string, string, string, string) error
	Delete(context.Context, string) error
}

func NewPurchaseReportRepository(client db.Client) PurchaseReportRepository {
	return &purchaseReportRepository{client}
}

//全件取得
func (prr *purchaseReportRepository) All(c context.Context) (*sql.Rows, error) {
	rows , err := prr.client.DB().QueryContext(c, "select * from purchase_reports")
	if err != nil {
		return nil, errors.Wrapf(err, "connenct SQL")
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
	item string,
	price string,
	userId string,
	purchaseOrderId string,
) error {
	var query = "insert into purchase_reports (item, price, user_id, purchase_order_id) values ('" + item + "'," + price + "," + userId  + "," + purchaseOrderId + ")"   
	_, err := ppr.client.DB().ExecContext(c, query)
	return err
}

//編集
func (ppr *purchaseReportRepository) Update(
	c context.Context,
	id string,
	item string,
	price string,
	userId string,
	purchaseOrderId string,
)error {
	var query = "update purchase_reports set item = '" + item + "', price = " + price + ", user_id = " + userId + ", purchase_order_id =" + purchaseOrderId + " where id = " + id
	_, err := ppr.client.DB().ExecContext(c, query) 
	return err
}

//削除
func (ppr *purchaseReportRepository) Delete (
	c context.Context,
	id string,
)error {
	_, err := ppr.client.DB().ExecContext(c, "Delete from purchase_reports where id =" + id)
	return err
}