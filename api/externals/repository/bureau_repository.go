package repository

import (
	"context"
	"database/sql"
	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/pkg/errors"
	"fmt"
)

type bureauRepository struct {
	client db.Client
}

type BureauRepository interface {
	All(context.Context) (*sql.Rows,error)
	Find(context.Context,string) (*sql.Row,error)
	Create(context.Context,string) error
	Update(context.Context,string,string) error
	Destroy(context.Context, string) error
}

func NewBureauRepository(client db.Client) BureauRepository {
	return &bureauRepository{client}
}

//全件取得
func (b *bureauRepository) All(c context.Context) (*sql.Rows, error){
	query := "select * from bureaus"
	rows, err := b.client.DB().QueryContext(c, query)
	if err != nil {
		return nil , errors.Wrapf(err, "cannot connect SQL")
	}
	fmt.Printf("\x1b[36m%s\n]",query)
	return rows,nil
}

//1件取得
func (b *bureauRepository) Find(c context.Context, id string) (*sql.Row,error) {
	query := "select * from bureaus where id ="+id
	row := b.client.DB().QueryRowContext(c,query)
	fmt.Printf("\x1b[36m%s\n]",query)
	return row,nil
}

//作成
func (b *bureauRepository) Create(c context.Context, name string) error {
	query := "Insert into bureaus (name) values (' "+name+"')"
	_, err := b.client.DB().ExecContext(c, query)
	fmt.Printf("\x1b[36m%s\n]",query)
	return err
}

//編集
func (b *bureauRepository) Update(c context.Context, id string, name string) error {
	query := "update bureaus set name = '"+name+"' where id = "+ id
	_, err := b.client.DB().ExecContext(c,query)
	fmt.Printf("\x1b[36m%s\n]",query)
	return err
}

//削除
func (b *bureauRepository) Destroy(c context.Context, id string) error {
	query := "delete from bureaus where id =" +id
	_, err := b.client.DB().ExecContext(c, query)
	fmt.Printf("\x1b[36m%s\n]",query)
	return err
}