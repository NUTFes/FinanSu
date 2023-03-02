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

//totalPriceの更新
func (er *expenseRepository) UpdateTotalprice(c context.Context) error {
	//tmp,tmp2のテーブルデータを削除
	query := `DELETE FROM tmp`
	er.crud.UpdateDB(c, query)
	query = `DELETE FROM tmp2`
	er.crud.UpdateDB(c, query)
	//tmpにpurchase_itemsのfinansu_checkがtrueのものをpurchase_orderごとに和を入れる
	query = `
		INSERT INTO
			tmp(id,totalPrice)
		SELECT 
			pi.purchase_order_id,
			SUM(pi.price * pi.quantity)
		FROM
			purchase_items pi
		WHERE
			pi.finance_check IS true
		GROUP BY
			pi.purchase_order_id`
	er.crud.UpdateDB(c, query)
	//tmpのデータにpurhchase_reportsのデータを入れる
	query = `
		UPDATE
			tmp
		INNER JOIN
			purchase_reports pr
		ON
			tmp.id = pr.purchase_order_id
		SET
			tmp.purchase_reports_id = pr.id,
			tmp.addition = pr.addition,
			tmp.discount = pr.discount,
			tmp.expense_id = pr.expense_id,
			tmp.finance_check = pr.finance_check`
	er.crud.UpdateDB(c, query)
	//purchaser_ordersでfinance_checkがfalseのデータを削除する
	query = `
		DELETE
			tmp
		FROM
			tmp
		INNER JOIN
			purchase_orders
		AS
			po
		ON
			tmp.id = po.id
		WHERE
			po.finance_check IS false`
	er.crud.UpdateDB(c, query)
	//tmpのデータをexpense_idごとにまとめて総和を求める、データをtmp2に入れる
	query = `
		INSERT INTO
			tmp2(id, totalPrice)
		SELECT
			tmp.expense_id,
			SUM(tmp.totalPrice + tmp.addition - tmp.discount)
		FROM
			tmp
		WHERE
			tmp.finance_check IS true
		GROUP BY
			tmp.expense_id`
	er.crud.UpdateDB(c, query)
	//tmp2のデータをexpeneseに入れる
	query = `
		UPDATE
			expense
		INNER JOIN
			tmp2
		ON
			expense.id = tmp2.id
		SET
			expense.totalPrice = tmp2.totalPrice;`
	return er.crud.UpdateDB(c, query)
}
