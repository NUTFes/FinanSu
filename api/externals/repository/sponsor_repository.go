package repository

import (
	"context"
	"database/sql"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
)

type sponsorRepository struct {
	client   db.Client
	abstract abstract.Crud
}

type SponsorRepository interface {
	All(context.Context) (*sql.Rows, error)
	Find(context.Context, string) (*sql.Row, error)
	Create(context.Context, string, string, string, string, string) error
	Update(context.Context, string, string, string, string, string, string) error
	Delete(context.Context, string) error
}

func NewSponsorRepository(c db.Client, ac abstract.Crud) SponsorRepository {
	return &sponsorRepository{c, ac}
}

// 全件取得
func (sr *sponsorRepository) All(c context.Context) (*sql.Rows, error) {
	query := "select * from sponsors"
	return sr.abstract.Read(c, query)
}

// 1件取得
func (sr *sponsorRepository) Find(c context.Context, id string) (*sql.Row, error) {
	query := "select * from sponsors where id = " + id
	return sr.abstract.ReadByID(c, query)
}

// 作成
func (sr *sponsorRepository) Create(
	c context.Context,
	name string,
	tel string,
	email string,
	address string,
	representative string,
) error {
	var query = "insert into sponsors (name, tel, email, address, representative) values ('" + name + "','" + tel + "','" + email + "','" + address + "','" + representative + "')"
	return sr.abstract.UpdateDB(c, query)
}

// 編集
func (sr *sponsorRepository) Update(
	c context.Context,
	id string,
	name string,
	tel string,
	email string,
	address string,
	representative string,
) error {
	var query = "update sponsors set name = '" + name + "', tel='" + tel + "', email = '" + email + "', address = '" + address + "', representative = '" + representative + "' where id = " + id
	return sr.abstract.UpdateDB(c, query)
}

// 削除
func (sr *sponsorRepository) Delete(
	c context.Context,
	id string,
) error {
	query := "Delete from sponsors where id =" + id
	return sr.abstract.UpdateDB(c, query)

}
