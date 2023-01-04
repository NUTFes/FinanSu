package repository

import (
	"context"
	"database/sql"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
)

type yearRepository struct {
	client   db.Client
	abstract abstract.Crud
}

type YearRepository interface {
	All(context.Context) (*sql.Rows, error)
	Find(context.Context, string) (*sql.Row, error)
	Create(context.Context, string) error
	Update(context.Context, string, string) error
	Destroy(context.Context, string) error
}

func NewYearRepository(c db.Client, ac abstract.Crud) YearRepository {
	return &yearRepository{c, ac}
}

// 全件取得
func (yr *yearRepository) All(c context.Context) (*sql.Rows, error) {
	query := "select * from years"
	return yr.abstract.Read(c, query)
}

// 1件取得
func (yr *yearRepository) Find(c context.Context, id string) (*sql.Row, error) {
	query := "select * from years where id = " + id
	return yr.abstract.ReadByID(c, query)
}

// 作成
func (yr *yearRepository) Create(c context.Context, year string) error {
	query := "insert into years (year) values ('" + year + "')"
	return yr.abstract.UpdateDB(c, query)
}

// 編集
func (yr *yearRepository) Update(c context.Context, id string, year string) error {
	query := "update years set year = '" + year + "' where id = " + id
	return yr.abstract.UpdateDB(c, query)
}

// 削除
func (yr *yearRepository) Destroy(c context.Context, id string) error {
	query := "delete from years where id = " + id
	return yr.abstract.UpdateDB(c, query)
}
