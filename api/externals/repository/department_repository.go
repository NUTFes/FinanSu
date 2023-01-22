package repository

import (
	"context"
	"database/sql"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
)

type departmentRepository struct {
	client db.Client
	crud   abstract.Crud
}

type DepartmentRepository interface {
	All(context.Context) (*sql.Rows, error)
	Find(context.Context, string) (*sql.Row, error)
	Create(context.Context, string) error
	Update(context.Context, string, string) error
	Destroy(context.Context, string) error
}

func NewDepartmentRepository(c db.Client, ac abstract.Crud) DepartmentRepository {
	return &departmentRepository{c, ac}
}

// 全件取得
func (dr *departmentRepository) All(c context.Context) (*sql.Rows, error) {
	query := "select * from departments"
	return dr.crud.Read(c, query)
}

// 1件取得
func (dr *departmentRepository) Find(c context.Context, id string) (*sql.Row, error) {
	query := "select * from departments where id = " + id
	return dr.crud.ReadByID(c, query)
}

// 作成
func (dr *departmentRepository) Create(c context.Context, name string) error {
	query := "insert into departments (name) values ('" + name + "')"
	return dr.crud.UpdateDB(c, query)
}

// 編集
func (dr *departmentRepository) Update(c context.Context, id string, name string) error {
	query := "update departments set name = '" + name + "' where id = " + id
	return dr.crud.UpdateDB(c, query)
}

// 削除
func (dr *departmentRepository) Destroy(c context.Context, id string) error {
	query := "delete from departments where id = " + id
	return dr.crud.UpdateDB(c, query)
}
