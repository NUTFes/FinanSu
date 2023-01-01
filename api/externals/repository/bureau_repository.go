package repository

import (
	"context"
	"database/sql"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
)

type bureauRepository struct {
	client db.Client
	crud   abstract.Crud
}

type BureauRepository interface {
	All(context.Context) (*sql.Rows, error)
	Find(context.Context, string) (*sql.Row, error)
	Create(context.Context, string) error
	Update(context.Context, string, string) error
	Destroy(context.Context, string) error
}

func NewBureauRepository(c db.Client, ac abstract.Crud) BureauRepository {
	return &bureauRepository{c, ac}
}

// 全件取得
func (b *bureauRepository) All(c context.Context) (*sql.Rows, error) {
	query := "select * from bureaus"
	return b.crud.Read(c, query)
}

// 1件取得
func (b *bureauRepository) Find(c context.Context, id string) (*sql.Row, error) {
	query := "select * from bureaus where id =" + id
	return b.crud.ReadByID(c, query)
}

// 作成
func (b *bureauRepository) Create(c context.Context, name string) error {
	query := "Insert into bureaus (name) values ('" + name + "')"
	return b.crud.UpdateDB(c, query)
}

// 編集
func (b *bureauRepository) Update(c context.Context, id string, name string) error {
	query := "update bureaus set name = '" + name + "' where id = " + id
	return b.crud.UpdateDB(c, query)
}

// 削除
func (b *bureauRepository) Destroy(c context.Context, id string) error {
	query := "delete from bureaus where id =" + id
	return b.crud.UpdateDB(c, query)
}
