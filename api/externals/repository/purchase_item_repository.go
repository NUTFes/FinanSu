package repository

import (
	"context"
	"database/sql"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
)

type purchaseItemRepository struct {
	client db.Client
	crud   abstract.Crud
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

func NewPurchaseItemRepository(c db.Client, ac abstract.Crud) PurchaseItemRepository {
	return &purchaseItemRepository{c, ac}
}

// 全件取得
func (pir *purchaseItemRepository) All(c context.Context) (*sql.Rows, error) {
	query := "select * from purchase_items"
	return pir.crud.Read(c, query)
}

// 1件取得
func (pir *purchaseItemRepository) Find(c context.Context, id string) (*sql.Row, error) {
	query := "select * from purchase_items where id = " + id
	return pir.crud.ReadByID(c, query)
}

// 作成
func (pir *purchaseItemRepository) Create(
	c context.Context,
	item string,
	price string,
	quantity string,
	detail string,
	url string,
	purchaseOrderId string,
	financeCheck string,
) error {
	var query = "insert into purchase_items (item, price, quantity, detail, url, purchase_order_id, finance_check) values ( '" + item + "'," + price + "," + quantity + ",'" + detail + "','" + url + "'," + purchaseOrderId + "," + financeCheck + ")"
	return pir.crud.UpdateDB(c, query)
}

// 編集
func (pir *purchaseItemRepository) Update(
	c context.Context,
	id string,
	item string,
	price string,
	quantity string,
	detail string,
	url string,
	purchaseOrderId string,
	financeCheck string,
) error {
	var query = "update purchase_items set item = '" + item + "' , price = " + price + ", quantity = " + quantity + ", detail ='" + detail + "', url = '" + url + "', purchase_order_id = " + purchaseOrderId + ", finance_check =" + financeCheck + " where id = " + id
	return pir.crud.UpdateDB(c, query)
}

// 削除
func (pir *purchaseItemRepository) Delete(
	c context.Context,
	id string,
) error {
	query := "Delete from purchase_items where id =" + id
	return pir.crud.UpdateDB(c, query)
}

// purchaseorderに紐づくpurchaseitemsを取得する(GETS)
func (pir *purchaseItemRepository) AllWithPurchaseOrder(c context.Context) (*sql.Rows, error) {
	query := "select purchase_items.id, purchase_items.item, purchase_items.price, purchase_items.quantity , purchase_items.detail, purchase_items.url, purchase_orders.deadline, users.name, purchase_items.finance_check, purchase_items.created_at, purchase_items.updated_at from purchase_items inner join purchase_orders on purchase_items.purchase_order_id  = purchase_orders.id inner join users on purchase_orders.user_id = users.id"
	return pir.crud.Read(c, query)
}

func (pir *purchaseItemRepository) FindWithPurchaseOrder(c context.Context, id string) (*sql.Row, error) {
	query := "select purchase_items.id, purchase_items.item, purchase_items.price, purchase_items.quantity , purchase_items.detail, purchase_items.url, purchase_orders.deadline, users.name, purchase_items.finance_check, purchase_items.created_at, purchase_items.updated_at from purchase_items inner join purchase_orders on purchase_items.purchase_order_id= purchase_orders.id inner join users on purchase_orders.user_id = users.id where purchase_items.id =" + id
	return pir.crud.ReadByID(c, query)
}
