package repository

import (
	"context"
	"database/sql"
	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/pkg/errors"
)

type departmentRepository struct {
	client db.Client
}

type DepartmentRepository interface {
	All(context.Context) (*sql.Rows, error)
	Find(context.Context, string) (*sql.Row, error)
	Create(context.Context, string) error
	Update(context.Context, string, string) error
	Destroy(context.Context, string) error
}

func NewDepartmentRepository(client db.Client) DepartmentRepository {
	return &departmentRepository{client}
}

// 全件取得
func (dr *departmentRepository) All(c context.Context) (*sql.Rows, error) {
	rows, err := dr.client.DB().QueryContext(c, "select * from departments")
	if err != nil {
		return nil, errors.Wrapf(err, "cannot connect SQL")
	}
	return rows, nil
}

// 1件取得
func (dr *departmentRepository) Find(c context.Context, id string) (*sql.Row, error) {
	row := dr.client.DB().QueryRowContext(c, "select * from departments where id = "+id)
	return row, nil
}

// 作成
func (dr *departmentRepository) Create(c context.Context, name string) error {
	_, err := dr.client.DB().ExecContext(c, "insert into departments (name) values ('"+name+"')")
	return err
}

// 編集
func (dr *departmentRepository) Update(c context.Context, id string, name string) error {
	_, err := dr.client.DB().ExecContext(c, "update departments set name = '"+name+"' where id = "+id)
	return err
}

// 削除
func (dr *departmentRepository) Destroy(c context.Context, id string) error {
	_, err := dr.client.DB().ExecContext(c, "delete from departments where id = "+id)
	return err
}
