package repository

import (
	"context"
	"database/sql"
	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/pkg/errors"
	"fmt"
)

type purchaseOrderRepository struct {
	client db.Client
}

type PurchaseOrderRepository interface {
	All(context.Context) (*sql.Rows, error)
	Find(context.Context, string) (*sql.Row, error)
	Create(context.Context, string, string, string) error
	Update(context.Context, string, string, string, string) error
	Delete(context.Context, string) error
	AllOrderWithUser(context.Context) (*sql.Rows,error)
	FindWithOrderItem(context.Context,string) (*sql.Row,error)
	GetPurchaseItemByOrderId(context.Context, string) (*sql.Rows,error)
}

func NewPurchaseOrderRepository(client db.Client) PurchaseOrderRepository {
	return &purchaseOrderRepository{client}
}

//全件取得
func (por *purchaseOrderRepository) All(c context.Context) (*sql.Rows, error) {
	query := "select * from purchase_orders"
	rows, err := por.client.DB().QueryContext(c, query)
	if err != nil {
		return nil, errors.Wrapf(err, "cannot connect SQL")
	}
	fmt.Printf("\x1b[36m%s\n", query)
	return rows, nil
}

//1件取得
func (por * purchaseOrderRepository) Find(c context.Context, id string) (*sql.Row, error) {
	query := "select * from purchase_orders where id = "+ id
	row := por.client.DB().QueryRowContext(c ,query)
	fmt.Printf("\x1b[36m%s\n", query)
	return row, nil
} 

//作成
func (por * purchaseOrderRepository) Create(
	c context.Context,
	deadLine string,
	userId string,
	financeCheck string,
) error {
		var query = "insert into purchase_orders (deadline, user_id, finance_check) values ( " + deadLine + "," + userId + "," + financeCheck +")"
		_, err := por.client.DB().ExecContext(c, query)
		fmt.Printf("\x1b[36m%s\n", query)
		return err
}

//編集
func (por * purchaseOrderRepository) Update(
	c context.Context,
	id string,
	deadLine string,
	userId string,
	financeCheck string,
) error {
	var query = "update purchase_orders set deadline ='" + deadLine + "', user_id = " + userId + ",finance_check = " + financeCheck	+ " where id = " + id 
	_, err := por.client.DB().ExecContext(c, query)
	fmt.Printf("\x1b[36m%s\n", query)
	return err 
}
//削除
func (por * purchaseOrderRepository) Delete(
	c context.Context,
	id string,
)error {
	query := "Delete from purchase_orders where id =" + id
	_, err := por.client.DB().ExecContext(c, query)
	fmt.Printf("\x1b[36m%s\n", query)
	return err
}

//orderに紐づくuserの取得(All)
func (p *purchaseOrderRepository) AllOrderWithUser(c context.Context) (*sql.Rows, error){
	query := "select * from purchase_orders inner join users on purchase_orders.user_id = users.id;"
	rows , err := p.client.DB().QueryContext(c,query)
	if err != nil {
		return nil, errors.Wrapf(err, "cannot connect SQL")
	}
	fmt.Printf("\x1b[36m%s\n", query)
	return rows, nil
}

//orderに紐づくuserの取得(byID)
func (p *purchaseOrderRepository) FindWithOrderItem(c context.Context, id string) (*sql.Row, error) {
	query := " select * from purchase_orders inner join users on purchase_orders.user_id = users.id where purchase_orders.id =" +id
	row := p.client.DB().QueryRowContext(c,query)
	fmt.Printf("\x1b[36m%s\n", query)
	return row,nil	
}

//指定したorder_idのitemを取得する
func (p *purchaseOrderRepository) GetPurchaseItemByOrderId(c context.Context, purchaseOrderID string) (*sql.Rows,error) {
	query := "select * from purchase_items where purchase_items.purchase_order_id ="+ purchaseOrderID
	rows, err := p.client.DB().QueryContext(c, query)
	if err!= nil {
		return nil, errors.Wrapf(err, "cannot connect SQL") 
	}
	fmt.Printf("\x1b[36m%s\n", query)
	return rows, nil
}