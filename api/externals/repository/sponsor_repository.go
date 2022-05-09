package repository

import (
	"context"
	"database/sql"
	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/pkg/errors"
	"fmt"
)

type sponsorRepository struct {
	client db.Client
}

type SponsorRepository interface {
	All(context.Context) (*sql.Rows, error)
	Find(context.Context, string) (*sql.Row, error)
	Create(context.Context, string, string, string, string, string) error
	Update(context.Context, string, string, string, string, string, string) error
	Delete(context.Context, string) error
}

func NewSponsorRepository(client db.Client) SponsorRepository {
	return &sponsorRepository{client}
}

//全件取得
func (sr *sponsorRepository) All(c context.Context) (*sql.Rows, error) {
	query := "select * from sponsors"
	rows, err := sr.client.DB().QueryContext(c, query)
	if err != nil {
		return nil, errors.Wrapf(err, "cannot connect SQL")
	}
	fmt.Printf("\x1b[36m%s\n", query)
	return rows, nil
}

//1件取得
func (sr *sponsorRepository) Find(c context.Context, id string) (*sql.Row, error){
	query := "select * from sponsors where id = " + id
	row := sr.client.DB().QueryRowContext(c, query)
	fmt.Printf("\x1b[36m%s\n", query)
	return row, nil
}

//作成
func (sr *sponsorRepository) Create(
	c context.Context,
	name string,
	tel string,
	email string,
	address string,
	representative string,
)error{
	var query ="insert into sponsors (name, tel, email, address, representative) values ('" + name + "','" + tel + "','" + email + "','" + address + "','" +representative + "')"
	_, err := sr.client.DB().ExecContext(c, query)
	fmt.Printf("\x1b[36m%s\n", query)
	return err
}

//編集
func (sr *sponsorRepository) Update(
	c context.Context,
	id string,
	name string,
	tel string,
	email string,
	address string,
	representative string,
)error {
	var query = "update sponsors set name = '" + name + "', tel='" + tel + "', email = '" + email + "', address = '" + address + "', representative = '" + representative + "' where id = " +id
	_, err := sr.client.DB().ExecContext(c, query)
	fmt.Printf("\x1b[36m%s\n", query)
	return err 
}

//削除
func (sr *sponsorRepository) Delete(
	c context.Context,
	id string,
)error {
	query := "Delete from sponsors where id =" + id
	_, err := sr.client.DB().ExecContext(c, query)
	fmt.Printf("\x1b[36m%s\n", query)
	return err
}
