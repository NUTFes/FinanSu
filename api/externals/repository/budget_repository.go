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
}

func NewBudgetRepository(client db.Client) BudgetRepository {
	return &budgetRepository{client}
}

// 全件取得
func (br *budgetRepository) All(c context.Context) (*sql.Rows, error) {
	// データベース接続
	rows, err := br.client.DB().Query("select * from budgets")
	if err != nil {
		return nil, errors.Wrapf(err, "cannot connect SQL")
	}
	return rows, nil
}

// 1件取得
func (br *budgetRepository) Find(c context.Context, id string) (*sql.Row, error) {
	// データベース接続

	row := br.client.DB().QueryRow("select * from budgets where id = " + id)
	return row, nil
}

// 作成
func (br *budgetRepository) Create(c context.Context, price string, yearID string, sourceID string) error {
	_, err := br.client.DB().Exec("insert into budgets (price, year_id, source_id) values (" + price + "," + yearID + "," + sourceID + ")")
	return err
}

// 編集
func (br *budgetRepository) Update(c context.Context, id string, price string, yearID string, sourceID string) error {
	_, err := br.client.DB().Exec("update budgets set price = " + price + ", year_id = " + yearID + ", source_id = " + sourceID + " where id = " + id)
	return err
}

// 削除
func (br *budgetRepository) Destroy(c context.Context, id string) error {
	_, err := br.client.DB().Exec("delete from budgets where id = " + id)
	return err
}
