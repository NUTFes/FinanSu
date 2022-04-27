package repository

import (
	"context"
	"database/sql"
	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/pkg/errors"
	"fmt"
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
	query := "select * from departments"
	rows, err := dr.client.DB().QueryContext(c, query)
	if err != nil {
		return nil, errors.Wrapf(err, "cannot connect SQL")
	}
	fmt.Printf("\x1b[36m%s\n", query)
	return rows, nil
}

// 1件取得
func (dr *departmentRepository) Find(c context.Context, id string) (*sql.Row, error) {
	query := "select * from departments where id = "+id
	row := dr.client.DB().QueryRowContext(c, query)
	fmt.Printf("\x1b[36m%s\n", query)
	return row, nil
}

// 作成
func (dr *departmentRepository) Create(c context.Context, name string) error {
	query := "insert into departments (name) values ('"+name+"')"
	_, err := dr.client.DB().ExecContext(c, query)
	fmt.Printf("\x1b[36m%s\n", query)
	return err
}

// 編集
func (dr *departmentRepository) Update(c context.Context, id string, name string) error {
	query := "update departments set name = '"+name+"' where id = "+id
	_, err := dr.client.DB().ExecContext(c, query)
	fmt.Printf("\x1b[36m%s\n", query)
	return err
}

// 削除
func (dr *departmentRepository) Destroy(c context.Context, id string) error {
	query := "delete from departments where id = "+id
	_, err := dr.client.DB().ExecContext(c, query)
	fmt.Printf("\x1b[36m%s\n", query)
	return err
}
