package repository

import (
	"context"
	"database/sql"
	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/pkg/errors"
)

type sourceRepository struct {
	client db.Client
}

type SourceRepository interface {
	All(context.Context) (*sql.Rows, error)
	Find(context.Context, string) (*sql.Row, error)
	Create(context.Context, string) error
	Update(context.Context, string, string) error
	Destroy(context.Context, string) error
}

func NewSourceRepository(client db.Client) SourceRepository {
	return &sourceRepository{client}
}

// 全件取得
func (sr *sourceRepository) All(c context.Context) (*sql.Rows, error) {
	rows, err := sr.client.DB().QueryContext(c, "select * from sources")
	if err != nil {
		return nil, errors.Wrapf(err, "cannot connect SQL")
	}
	return rows, nil
}

// 1件取得
func (sr *sourceRepository) Find(c context.Context, id string) (*sql.Row, error) {
	row := sr.client.DB().QueryRowContext(c, "select * from sources where id = "+id)
	return row, nil
}

// 作成
func (sr *sourceRepository) Create(c context.Context, name string) error {
	_, err := sr.client.DB().ExecContext(c, "insert into sources (name) values ('"+name+"')")
	return err
}

// 編集
func (sr *sourceRepository) Update(c context.Context, id string, name string) error {
	_, err := sr.client.DB().ExecContext(c, "update sources set name = '"+name+"' where id = "+id)
	return err
}

// 削除
func (sr *sourceRepository) Destroy(c context.Context, id string) error {
	_, err := sr.client.DB().ExecContext(c, "delete from sources where id = "+id)
	return err
}
