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
	Create(context.Context, string, string, string, string, string, string, string, string) error
	Update(context.Context, string, string, string, string, string, string, string, string, string) error
	Delete(context.Context, string) error
	AllDetails(context.Context) (*sql.Rows, error)
	FindDetails(context.Context, string) (*sql.Row, error)
	FindNewRecord(context.Context) (*sql.Row, error)
}

func NewPurchaseItemRepository(c db.Client, ac abstract.Crud) PurchaseItemRepository {
	return &purchaseItemRepository{c, ac}
}

// 全件取得
func (pir *purchaseItemRepository) All(c context.Context) (*sql.Rows, error) {
	query := "SELECT * FROM purchase_items"
	return pir.crud.Read(c, query)
}

// 1件取得
func (pir *purchaseItemRepository) Find(c context.Context, id string) (*sql.Row, error) {
	query := "SELECT * FROM purchase_items WHERE id = " + id
	return pir.crud.ReadByID(c, query)
}

// 作成
func (pir *purchaseItemRepository) Create(
	c context.Context,
	item string,
	price string,
	quantity string,
	sourceId string,
	detail string,
	url string,
	purchaseOrderId string,
	financeCheck string,
) error {
	query := `
		INSERT INTO
			purchase_items (item, price, quantity,source_id,  detail, url, purchase_order_id, finance_check)
		VALUES ( '` + item + "'," + price + "," + quantity + "," + sourceId + ",'" + detail + "','" + url + "'," + purchaseOrderId + "," + financeCheck + ")"
	return pir.crud.UpdateDB(c, query)
}

// 編集
func (pir *purchaseItemRepository) Update(
	c context.Context,
	id string,
	item string,
	price string,
	quantity string,
	sourceId string,
	detail string,
	url string,
	purchaseOrderId string,
	financeCheck string,
) error {
	query := `
		UPDATE
			purchase_items
		SET
			item = '` + item +
		"' , price = " + price +
		", quantity = " + quantity +
		", source_id = " + sourceId + 
		", detail ='" + detail +
		"', url = '" + url +
		"', purchase_order_id = " + purchaseOrderId +
		", finance_check =" + financeCheck +
		" WHERE id = " + id
	return pir.crud.UpdateDB(c, query)
}

// 削除
func (pir *purchaseItemRepository) Delete(
	c context.Context,
	id string,
) error {
	query := "DELETE FROM purchase_items WHERE id =" + id
	return pir.crud.UpdateDB(c, query)
}

// purchaseorderに紐づくpurchaseitemsを取得する(GETS)
func (pir *purchaseItemRepository) AllDetails(c context.Context) (*sql.Rows, error) {
	query := `
		SELECT
			purchase_items.id,
			purchase_items.item,
			purchase_items.price,
			purchase_items.quantity,
			purchase_items.source_id,
			purchase_items.detail,
			purchase_items.url,
			purchase_items.purchase_order_id,
			purchase_items.finance_check,
			purchase_items.created_at,
			purchase_items.updated_at,
			purchase_orders.id,
			purchase_orders.deadline,
			purchase_orders.user_id,
			purchase_orders.expense_id,
			purchase_orders.finance_check,
			users.id, users.name,
			users.bureau_id,
			users.role_id
		FROM
			purchase_items
		INNER JOIN
			purchase_orders
		ON
			purchase_items.purchase_order_id= purchase_orders.id
		INNER JOIN
			users
		ON
			purchase_orders.user_id = users.id`
	return pir.crud.Read(c, query)
}

func (pir *purchaseItemRepository) FindDetails(c context.Context, id string) (*sql.Row, error) {
	query := `
		SELECT
			purchase_items.id,
			purchase_items.item,
			purchase_items.price,
			purchase_items.quantity,
			purchase_items.source_id,
			purchase_items.detail,
			purchase_items.url,
			purchase_items.purchase_order_id,
			purchase_items.finance_check,
			purchase_items.created_at,
			purchase_items.updated_at,
			purchase_orders.id,
			purchase_orders.deadline,
			purchase_orders.user_id,
			purchase_orders.expense_id,
			purchase_orders.finance_check,
			users.id, users.name,
			users.bureau_id,
			users.role_id
		FROM
			purchase_items
		INNER JOIN
			purchase_orders
		ON
			purchase_items.purchase_order_id= purchase_orders.id
		INNER JOIN
			users
		ON
			purchase_orders.user_id = users.id
		WHERE
			purchase_items.id =` + id
	return pir.crud.ReadByID(c, query)
}

// 最新のレコードを取得
func (pir *purchaseItemRepository) FindNewRecord(c context.Context) (*sql.Row, error) {
	query := `SELECT * FROM purchase_items ORDER BY id DESC LIMIT 1`
	return pir.crud.ReadByID(c, query)
}
