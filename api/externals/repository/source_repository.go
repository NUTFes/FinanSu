package repository

import (
	"context"
	"database/sql"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
)

type sourceRepository struct {
	client   db.Client
	abstract abstract.Crud
}

type SourceRepository interface {
	All(context.Context) (*sql.Rows, error)
	Find(context.Context, string) (*sql.Row, error)
	Create(context.Context, string) error
	Update(context.Context, string, string) error
	Destroy(context.Context, string) error
}

func NewSourceRepository(c db.Client, ac abstract.Crud) SourceRepository {
	return &sourceRepository{c, ac}
}

// 全件取得
func (sr *sourceRepository) All(c context.Context) (*sql.Rows, error) {
	query := "select * from sources"
	return sr.abstract.Read(c, query)
}

// 1件取得
func (sr *sourceRepository) Find(c context.Context, id string) (*sql.Row, error) {
	query := "select * from sources where id = " + id
	return sr.abstract.ReadByID(c, query)
}

// 作成
func (sr *sourceRepository) Create(c context.Context, name string) error {
	query := "insert into sources (name) values ('" + name + "')"
	return sr.abstract.UpdateDB(c, query)
}

// 編集
func (sr *sourceRepository) Update(c context.Context, id string, name string) error {
	query := "update sources set name = '" + name + "' where id = " + id
	return sr.abstract.UpdateDB(c, query)
}

// 削除
func (sr *sourceRepository) Destroy(c context.Context, id string) error {
	query := "delete from sources where id = " + id
	return sr.abstract.UpdateDB(c, query)
}
