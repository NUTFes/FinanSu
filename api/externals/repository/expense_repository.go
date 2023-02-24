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
	Destroy(context.Context, string) error
	FindLatestRecord(context.Context) (*sql.Row, error)
}

func NewExpenseRepository(c db.Client, ac abstract.Crud) ExpenseRepository {
	return &expenseRepository{c, ac}
}

// 全件取得
func (er *expenseRepository) All(c context.Context) (*sql.Rows, error) {
	query := "SELECT * FROM expense"
	return er.crud.Read(c, query)
}

// 1件取得
func (er *expenseRepository) Find(c context.Context, id string) (*sql.Row, error) {
	query := "SELECT * FROM expense WHERE id = " + id
	return er.crud.ReadByID(c, query)
}

// 作成
func (er *expenseRepository) Create(c context.Context, name string, yearID string) error {
	query := `
		INSERT INTO
			expense (name,yearID)
		VALUES
			('` + name + "'," + yearID + ")"
	return er.crud.UpdateDB(c, query)
}

// 編集
func (er *expenseRepository) Update(c context.Context, id string, name string, yearID string) error {
	query := `
		UPDATE
			expense
		SET name = '` + name +
		"', yearID = " + yearID +
		" WHERE id = " + id
	return er.crud.UpdateDB(c, query)
}

// 削除
func (er *expenseRepository) Destroy(c context.Context, id string) error {
	query := "DELETE FROM expense WHERE id = " + id
	return er.crud.UpdateDB(c, query)
}

func (er *expenseRepository) FindLatestRecord(c context.Context) (*sql.Row, error) {
	query := `SELECT * FROM expense ORDER BY id DESC LIMIT 1`
	return er.crud.ReadByID(c, query)
}
