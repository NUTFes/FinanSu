package repository

import(
	"context"
	"database/sql"
	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/pkg/errors"
	"fmt"
)

type purchaseItemRepository struct {
	client db.Client
}

type PurchaseItemRepository interface {
	All(context.Context) (*sql.Rows, error)
	Find(context.Context, string) (*sql.Row, error)
	Create(context.Context, string, string, string, string, string, string, string) error
	Update(context.Context, string, string, string, string, string, string, string, string) error
	Delete(context.Context, string) error
	AllWithPurchaseOrder(context.Context) (*sql.Rows, error)
	FindWithPurchaseOrder(context.Context, string) (*sql.Row, error)
}

func NewPurchaseItemRepository(client db.Client) PurchaseItemRepository{
	return &purchaseItemRepository{client}
}

//全件取得
func (pir *purchaseItemRepository) All(c context.Context) (*sql.Rows, error){
	query := "select * from purchase_items"
	rows , err := pir.client.DB().QueryContext(c, query)
	if err != nil {
		return nil , errors.Wrapf(err, "cannot connenct SQL")
	}
	fmt.Printf("\x1b[36m%s\n", query)
	return rows, nil
}

//1件取得
func (pir *purchaseItemRepository) Find(c context.Context, id string) (*sql.Row, error){
	query := "select * from purchase_items where id = " + id
	row := pir.client.DB().QueryRowContext(c, query)
	fmt.Printf("\x1b[36m%s\n", query)
	return row, nil
}

//作成
func (pir *purchaseItemRepository) Create(
	c context.Context,
	item string,
	price string,
	quantity string,
	detail string,
	url string,
	purchaseOrderId string,
	finansuCheck string,
)error {
	var query = "insert into purchase_items (item, price, quantity, detail, url, purchase_order_id, finance_check) values ( '" + item + "'," + price + "," + quantity + ",'" + detail + "','" + url + "'," + purchaseOrderId + "," + finansuCheck + ")"
	_, err := pir.client.DB().ExecContext(c, query)
	fmt.Printf("\x1b[36m%s\n", query)
	return err
}

//編集
func (pir *purchaseItemRepository) Update(
	c context.Context,
	id string,
	item string,
	price string,
	quantity string,
	detail string,
	url string,
	purchaseOrderId string,
	finansuCheck string,
)error {
	var query = "update purchase_items set item = '" + item + "' , price = " + price + ", quantity = " + quantity + ", detail ='" + detail + "', url = '" + url + "', purchase_order_id = " + purchaseOrderId + ", finance_check =" + finansuCheck + " where id = " + id
	_, err := pir.client.DB().ExecContext(c, query)
	return err
}

//削除
func (pir *purchaseItemRepository) Delete(
	c context.Context,
	id string,
)error {
	query := "Delete from purchase_items where id =" + id
	_, err := pir.client.DB().ExecContext(c, query)
	fmt.Printf("\x1b[36m%s\n", query)
	return err
}

//purchaseorderに紐づくpurchaseitemsを取得する(GETS)
func (pir *purchaseItemRepository) AllWithPurchaseOrder(c context.Context) (*sql.Rows, error) {
	query := "select purchase_items.id, purchase_items.item, purchase_items.price, purchase_items.quantity , purchase_items.detail, purchase_items.url, purchase_orders.deadline, users.name, purchase_items.finance_check, purchase_items.created_at, purchase_items.updated_at from purchase_items inner join purchase_orders on purchase_items.purchase_order_id  = purchase_orders.id inner join users on purchase_orders.user_id = users.id"
	rows, err := pir.client.DB().QueryContext(c, query)
	if err != nil {
		return nil, errors.Wrapf(err, "cannot connect SQL")
	}
	fmt.Printf("\x1b[36m%s\n", query)
	return rows, nil
}

func (pir *purchaseItemRepository) FindWithPurchaseOrder(c context.Context, id string) (*sql.Row, error) {
	query :=  "select purchase_items.id, purchase_items.item, purchase_items.price, purchase_items.quantity , purchase_items.detail, purchase_items.url, purchase_orders.deadline, users.name, purchase_items.finance_check, purchase_items.created_at, purchase_items.updated_at from purchase_items inner join purchase_orders on purchase_items.purchase_order_id= purchase_orders.id inner join users on purchase_orders.user_id = users.id where purchase_items.id ="+id
	row:= pir.client.DB().QueryRowContext(c,query)
	fmt.Printf("\x1b[36m%s\n", query)
	return row, nil
}
