package repository

import (
	"context"
	"database/sql"
	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/pkg/errors"
)

type budgetRepository struct {
	client db.Client
}

type BudgetRepository interface {
	All(context.Context) (*sql.Rows, error)
	Find(context.Context, string) (*sql.Row, error)
	Create(context.Context, string, string, string) error
	Update(context.Context, string, string, string, string) error
	Destroy(context.Context, string) error
	//Budgetに紐づくyearとsourceを取得する
	FindYearAndSource(context.Context, string) (*sql.Row, error)
}

func NewBudgetRepository(client db.Client) BudgetRepository {
	return &budgetRepository{client}
}

// 全件取得
func (br *budgetRepository) All(c context.Context) (*sql.Rows, error) {
	rows, err := br.client.DB().QueryContext(c, "select * from budgets")
	if err != nil {
		return nil, errors.Wrapf(err, "cannot connect SQL")
	}
	return rows, nil
}

// 1件取得
func (br *budgetRepository) Find(c context.Context, id string) (*sql.Row, error) {
	row := br.client.DB().QueryRowContext(c, "select * from budgets where id = "+id)
	return row, nil
}

// 作成
func (br *budgetRepository) Create(c context.Context, price string, yearID string, sourceID string) error {
	_, err := br.client.DB().ExecContext(c, "insert into budgets (price, year_id, source_id) values ("+price+","+yearID+","+sourceID+")")
	return err
}

// 編集
func (br *budgetRepository) Update(c context.Context, id string, price string, yearID string, sourceID string) error {
	_, err := br.client.DB().ExecContext(c, "update budgets set price = "+price+", year_id = "+yearID+", source_id = "+sourceID+" where id = "+id)
	return err
}

// 削除
func (br *budgetRepository) Destroy(c context.Context, id string) error {
	_, err := br.client.DB().ExecContext(c, "delete from budgets where id = "+id)
	return err
}

//Budgetに紐づくyearとsourceを取得する
func (br *budgetRepository) FindYearAndSource(c context.Context, id string) (*sql.Row, error) {
	row := br.client.DB().QueryRowContext(c, "SELECT budgets.id, budgets.price, years.year, sources.name, budgets.created_at, budgets.updated_at FROM budgets INNER JOIN years ON budgets.year_id = years.id INNER JOIN sources ON budgets.source_id = sources.id where budgets.id = " + id)
	return row, nil
}
