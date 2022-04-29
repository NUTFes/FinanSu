package repository

import (
	"context"
	"database/sql"
	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/pkg/errors"
	"fmt"
)

type yearRepository struct {
	client db.Client
}

type YearRepository interface {
	All(context.Context) (*sql.Rows, error)
	Find(context.Context, string) (*sql.Row, error)
	Create(context.Context, string) error
	Update(context.Context, string, string) error
	Destroy(context.Context, string) error
}

func NewYearRepository(client db.Client) YearRepository {
	return &yearRepository{client}
}

// 全件取得
func (yr *yearRepository) All(c context.Context) (*sql.Rows, error) {
	query := "select * from years"
	rows, err := yr.client.DB().QueryContext(c,query )
	if err != nil {
		return nil, errors.Wrapf(err, "cannot connect SQL")
	}
	fmt.Printf("\x1b[36m%s\n", query)
	return rows, nil
}

// 1件取得
func (yr *yearRepository) Find(c context.Context, id string) (*sql.Row, error) {
	query := "select * from years where id = "+id
	row := yr.client.DB().QueryRowContext(c, query)
	fmt.Printf("\x1b[36m%s\n", query)
	return row, nil
}

// 作成
func (yr *yearRepository) Create(c context.Context, year string) error {
	query := "insert into years (year) values ('"+year+"')"
	_, err := yr.client.DB().ExecContext(c, query)
	fmt.Printf("\x1b[36m%s\n", query)
	return err
}

// 編集
func (yr *yearRepository) Update(c context.Context, id string, year string) error {
	query := "update years set year = '"+year+"' where id = "+id
	_, err := yr.client.DB().ExecContext(c, query)
	fmt.Printf("\x1b[36m%s\n", query)
	return err
}

// 削除
func (yr *yearRepository) Destroy(c context.Context, id string) error {
	query :="delete from years where id = "+id
	_, err := yr.client.DB().ExecContext(c, query)
	fmt.Printf("\x1b[36m%s\n", query)
	return err
}
