package repository

import (
	"context"
	"database/sql"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
)

type purchaseOrderRepository struct {
	client db.Client
	crud   abstract.Crud
}

type PurchaseOrderRepository interface {
	All(context.Context) (*sql.Rows, error)
	Find(context.Context, string) (*sql.Row, error)
	Create(context.Context, string, string, string, string) error
	Update(context.Context, string, string, string, string, string) error
	Delete(context.Context, string) error
	AllUserInfo(context.Context) (*sql.Rows, error)
	FindUserInfo(context.Context, string) (*sql.Row, error)
	FindPurchaseItem(context.Context, string) (*sql.Rows, error)
	FindNewRecord(context.Context) (*sql.Row, error)
	DeleteItems(context.Context, string) error
	DeleteReport(context.Context, string) error
	AllUserInfoByYear(context.Context, string) (*sql.Rows, error)
}

func NewPurchaseOrderRepository(c db.Client, ac abstract.Crud) PurchaseOrderRepository {
	return &purchaseOrderRepository{c, ac}
}

// 全件取得
func (por *purchaseOrderRepository) All(c context.Context) (*sql.Rows, error) {
	query := "SELECT * FROM purchase_orders"
	return por.crud.Read(c, query)
}

// 1件取得
func (por *purchaseOrderRepository) Find(c context.Context, id string) (*sql.Row, error) {
	query := "SELECT * FROM purchase_orders WHERE id = " + id
	return por.crud.ReadByID(c, query)
}

// 作成
func (por *purchaseOrderRepository) Create(
	c context.Context,
	deadLine string,
	userId string,
	expenseId string,
	financeCheck string,
) error {
	query := `
		INSERT INTO
			purchase_orders (deadline, user_id, expense_id, finance_check)
		VALUES ('` + deadLine + "'," + userId + "," + expenseId + "," +financeCheck + ")"
	return por.crud.UpdateDB(c, query)
}

// 編集
func (por *purchaseOrderRepository) Update(
	c context.Context,
	id string,
	deadLine string,
	userId string,
	expenseId string,
	financeCheck string,
) error {
	query := `
		UPDATE
			purchase_orders
		SET
			deadline ='` + deadLine +
		"', user_id = " + userId +
		", expense_id = " + expenseId +
		", finance_check = " + financeCheck +
		" WHERE id = " + id
	return por.crud.UpdateDB(c, query)
}

// 削除
func (por *purchaseOrderRepository) Delete(
	c context.Context,
	id string,
) error {
	query := `DELETE FROM purchase_orders WHERE id =` + id
	return por.crud.UpdateDB(c, query)
}

// orderに紐づくuserの取得(All)
func (p *purchaseOrderRepository) AllUserInfo(c context.Context) (*sql.Rows, error) {
	query := `
		SELECT
			*
		FROM
			purchase_orders
		INNER JOIN
			users
		ON
			purchase_orders.user_id = users.id;`
	return p.crud.Read(c, query)
}

// orderに紐づくuserの取得(byID)
func (p *purchaseOrderRepository) FindUserInfo(c context.Context, id string) (*sql.Row, error) {
	query := `
		SELECT
			*
		FROM
			purchase_orders
		INNER JOIN
			users
		ON
			purchase_orders.user_id = users.id
		WHERE
			purchase_orders.id =` + id
	return p.crud.ReadByID(c, query)
}

// 指定したorder_idのitemを取得する
func (p *purchaseOrderRepository) FindPurchaseItem(c context.Context, purchaseOrderID string) (*sql.Rows, error) {
	query := `
		SELECT
			*
		FROM
			purchase_items
		WHERE
			purchase_items.purchase_order_id =` + purchaseOrderID
	return p.crud.Read(c, query)
}

// 最新のレコードを取得
func (por *purchaseOrderRepository) FindNewRecord(c context.Context) (*sql.Row, error) {
	query := `
		SELECT
			*
		FROM
			purchase_orders
		ORDER BY
			id
		DESC LIMIT 1`
	return por.crud.ReadByID(c, query)
}

// 紐づいたitemの削除
func (por *purchaseOrderRepository) DeleteItems(
	c context.Context,
	id string,
) error {
	query := `DELETE FROM purchase_items WHERE purchase_order_id =` + id
	return por.crud.UpdateDB(c, query)
}

// 紐づいたreportの削除
func (por *purchaseOrderRepository) DeleteReport(
	c context.Context,
	id string,
) error {
	query := `DELETE FROM purchase_reports WHERE purchase_order_id =` + id
	return por.crud.UpdateDB(c, query)
}

func (p *purchaseOrderRepository) AllUserInfoByYear(c context.Context, year string) (*sql.Rows, error) {
	query := `
		SELECT
			purchase_orders.id,
			purchase_orders.deadline,
			purchase_orders.user_id,
			purchase_orders.expense_id,
			purchase_orders.finance_check,
			purchase_orders.created_at,
			purchase_orders.updated_at,
			users.id,
			users.name,
			users.bureau_id,
			users.role_id,
			users.created_at,
			users.updated_at
		FROM
			purchase_orders
		INNER JOIN
			users
		ON
			purchase_orders.user_id = users.id
		INNER JOIN
			year_periods
		ON
			purchase_orders.created_at > year_periods.started_at
		AND
			purchase_orders.created_at < year_periods.ended_at
		INNER JOIN
			years
		ON
			year_periods.year_id = years.id
		WHERE
			years.year = ` + year +
		" ORDER BY purchase_orders.id"
	return p.crud.Read(c, query)
}

