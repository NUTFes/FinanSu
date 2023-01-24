package repository

import (
	"context"
	"database/sql"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
)

type budgetRepository struct {
	client db.Client
	crud   abstract.Crud
}

type BudgetRepository interface {
	All(context.Context) (*sql.Rows, error)
	Find(context.Context, string) (*sql.Row, error)
	Create(context.Context, string, string, string) error
	Update(context.Context, string, string, string, string) error
	Destroy(context.Context, string) error
	//Budgetに紐づくyearとsourceを取得する
	FindYearAndSource(context.Context, string) (*sql.Row, error)
	//最新のbudgetを取得する
	FindLatestRecord(context.Context) (*sql.Row, error)
}

func NewBudgetRepository(c db.Client, ac abstract.Crud) BudgetRepository {
	return &budgetRepository{c, ac}
}

// 全件取得
func (br *budgetRepository) All(c context.Context) (*sql.Rows, error) {
	query := "select * from budgets"
	return br.crud.Read(c, query)
}

// 1件取得
func (br *budgetRepository) Find(c context.Context, id string) (*sql.Row, error) {
	query := "select * from budgets where id = " + id
	return br.crud.ReadByID(c, query)
}

// 作成
func (br *budgetRepository) Create(c context.Context, price string, yearID string, sourceID string) error {
	query := "insert into budgets (price, year_id, source_id) values (" + price + "," + yearID + "," + sourceID + ")"
	return br.crud.UpdateDB(c, query)
}

// 編集
func (br *budgetRepository) Update(c context.Context, id string, price string, yearID string, sourceID string) error {
	query := "update budgets set price = " + price + ", year_id = " + yearID + ", source_id = " + sourceID + " where id = " + id
	return br.crud.UpdateDB(c, query)
}

// 削除
func (br *budgetRepository) Destroy(c context.Context, id string) error {
	query := "delete from budgets where id = " + id
	return br.crud.UpdateDB(c, query)
}

// Budgetに紐づくyearとsourceを取得する
func (br *budgetRepository) FindYearAndSource(c context.Context, id string) (*sql.Row, error) {
	query := "SELECT budgets.id, budgets.price, budgets.year_id, budgets.source_id, budgets.created_at, budgets.updated_at, years.id, years.year, years.created_at, years.updated_at, sources.id, sources.name, sources.created_at, sources.updated_at FROM budgets INNER JOIN years ON budgets.year_id = years.id INNER JOIN sources ON budgets.source_id = sources.id where budgets.id = " + id
	return br.crud.ReadByID(c, query)
}

// 最新のbudgetを取得する
func (br *budgetRepository) FindLatestRecord(c context.Context) (*sql.Row, error) {
	query := `
		SELECT
			*
		FROM
			budgets
		ORDER BY
			id
		DESC LIMIT 1
	`
	return br.crud.ReadByID(c, query)
}
