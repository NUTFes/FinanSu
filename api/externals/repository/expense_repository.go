package repository

import (
	"context"
	"database/sql"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
)

type expenseRepository struct {
	client db.Client
	crud   abstract.Crud
}

type ExpenseRepository interface {
	All(context.Context) (*sql.Rows, error)
	Find(context.Context, string) (*sql.Row, error)
	Create(context.Context, string, string) error
	Update(context.Context, string, string, string) error
	UpdateTotalprice(context.Context) error
	Destroy(context.Context, string) error
	FindLatestRecord(context.Context) (*sql.Row, error)
	AllItemInfo(context.Context, string) (*sql.Rows, error)
	AllOrderAndReportInfo(context.Context, string) (*sql.Rows, error)
	AllByPeriod(context.Context, string) (*sql.Rows, error)
}

func NewExpenseRepository(c db.Client, ac abstract.Crud) ExpenseRepository {
	return &expenseRepository{c, ac}
}

func (er *expenseRepository) All(c context.Context) (*sql.Rows, error) {
	query := "SELECT * FROM expense"
	return er.crud.Read(c, query)
}

func (er *expenseRepository) Find(c context.Context, id string) (*sql.Row, error) {
	query := "SELECT * FROM expense WHERE id = " + id
	return er.crud.ReadByID(c, query)
}

func (er *expenseRepository) Create(c context.Context, name string, yearID string) error {
	query := `
		INSERT INTO
			expense (expense_name,yearID)
		VALUES
			('` + name + "'," + yearID + ")"
	return er.crud.UpdateDB(c, query)
}

func (er *expenseRepository) Update(c context.Context, id string, name string, yearID string) error {
	query := `
		UPDATE
			expense
		SET expense_name = '` + name +
		"', yearID = " + yearID +
		" WHERE id = " + id
	return er.crud.UpdateDB(c, query)
}

func (er *expenseRepository) Destroy(c context.Context, id string) error {
	query := "DELETE FROM expense WHERE id = " + id
	return er.crud.UpdateDB(c, query)
}

func (er *expenseRepository) FindLatestRecord(c context.Context) (*sql.Row, error) {
	query := `SELECT * FROM expense ORDER BY id DESC LIMIT 1`
	return er.crud.ReadByID(c, query)
}

// totalPriceの更新
func (er *expenseRepository) UpdateTotalprice(c context.Context) error {
	query := `CALL updateExpense`
	return er.crud.UpdateDB(c, query)
}

// purchase_order_idに紐づいたpuchase_itemsを取得
func (er *expenseRepository) AllItemInfo(c context.Context, purchaseOrderID string) (*sql.Rows, error) {
	query := `
		SELECT
			*
		FROM
			purchase_items pi
		WHERE
			pi.purchase_order_id = ` + purchaseOrderID + `
		AND
			pi.finance_check IS true;`
	return er.crud.Read(c, query)
}

// expense_idに紐づくpurchase_ordersを取得
func (er *expenseRepository) AllOrderAndReportInfo(c context.Context, expenseID string) (*sql.Rows, error) {
	query := `
		SELECT
			*
		FROM
			purchase_reports pr
		INNER JOIN
			purchase_orders po
		ON
			pr.purchase_order_id = po.id 
		WHERE po.expense_id = ` + expenseID + `
		AND
			pr.finance_check IS true
		AND
			po.finance_check IS true
		`
	return er.crud.Read(c, query)
}

func (er *expenseRepository) AllByPeriod(c context.Context, year string) (*sql.Rows, error) {
	query := `
			SELECT
				*
			FROM
				expense
			INNER JOIN
				years
			ON
				expense.yearID = years.id
			WHERE
				years.year = ` + year +
			" ORDER BY expense.id;"
	return er.crud.Read(c, query)
}
