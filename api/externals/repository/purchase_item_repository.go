package repository

import(
	"context"
	"database/sql"
	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/pkg/errors"
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
}

func NewPurchaseItemRepository(client db.Client) PurchaseItemRepository{
	return &purchaseItemRepository{client}
}

//全件取得
func (pir *purchaseItemRepository) All(c context.Context) (*sql.Rows, error){
	rows , err := pir.client.DB().QueryContext(c, "select * from purchase_items")
	if err != nil {
		return nil , errors.Wrapf(err, "cannot connenct SQL")
	}
	return rows, nil
}

//1権取得
func (pir *purchaseItemRepository) Find(c context.Context, id string) (*sql.Row, error){
	row := pir.client.DB().QueryRowContext(c, "select * from purchase_items where id = " + id)
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
	var query = "insert into purchase_items (item, price, quantity, detail, url, purchase_order_id, finansu_check) values ( '" + item + "'," + price + "," + quantity + ",'" + detail + "','" + url + "'," + purchaseOrderId + "," + finansuCheck + ")"
	_, err := pir.client.DB().ExecContext(c, query)
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
	var query = "update purchase_items set item = '" + item + "' , price = " + price + ", quantity = " + quantity + ", detail ='" + detail + "', url = '" + url + "', purchase_order_id = " + purchaseOrderId + ", finansu_check =" + finansuCheck + " where id = " + id
	_, err := pir.client.DB().ExecContext(c, query)
	return err
}

func (pir *purchaseItemRepository) Delete(
	c context.Context,
	id string,
)error {
	_, err := pir.client.DB().ExecContext(c, "Delete from purchase_items where id =" + id)
	return err
}
