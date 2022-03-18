package repository

import (
	"context"
	"database/sql"
	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/pkg/errors"
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
	rows, err := yr.client.DB().QueryContext(c, "select * from years")
	if err != nil {
		return nil, errors.Wrapf(err, "cannot connect SQL")
	}
	return rows, nil
}

// 1件取得
func (yr *yearRepository) Find(c context.Context, id string) (*sql.Row, error) {
	row := yr.client.DB().QueryRowContext(c, "select * from years where id = "+id)
	return row, nil
}

// 作成
func (yr *yearRepository) Create(c context.Context, year string) error {
	_, err := yr.client.DB().ExecContext(c, "insert into years (year) values ('"+year+"')")
	return err
}

// 編集
func (yr *yearRepository) Update(c context.Context, id string, year string) error {
	_, err := yr.client.DB().ExecContext(c, "update years set year = '"+year+"' where id = "+id)
	return err
}

// 削除
func (yr *yearRepository) Destroy(c context.Context, id string) error {
	_, err := yr.client.DB().ExecContext(c, "delete from years where id = "+id)
	return err
}
