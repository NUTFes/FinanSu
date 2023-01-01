package repository

import (
	"context"
	"database/sql"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
)

type sponsorStyleRepository struct {
	client   db.Client
	abstract abstract.Crud
}

type SponsorStyleRepository interface {
	All(context.Context) (*sql.Rows, error)
	Find(context.Context, string) (*sql.Row, error)
	Create(context.Context, string, string, string) error
	Update(context.Context, string, string, string, string) error
	Delete(context.Context, string) error
}

func NewSponsorStyleRepository(c db.Client, ac abstract.Crud) SponsorStyleRepository {
	return &sponsorStyleRepository{c, ac}
}

// 全件取得
func (ssr *sponsorStyleRepository) All(c context.Context) (*sql.Rows, error) {
	query := "select * from sponsor_styles"
	return ssr.abstract.Read(c, query)
}

// １件取得
func (ssr *sponsorStyleRepository) Find(c context.Context, id string) (*sql.Row, error) {
	query := "select *from sponsor_styles where id = " + id
	return ssr.abstract.ReadByID(c, query)
}

// 作成
func (ssr *sponsorStyleRepository) Create(
	c context.Context,
	scale string,
	isColor string,
	price string,
) error {
	var query = "insert into sponsor_styles (scale, is_color, price) values ('" + scale + "'," + isColor + "," + price + ")"
	return ssr.abstract.UpdateDB(c, query)
}

// 編集
func (ssr *sponsorStyleRepository) Update(
	c context.Context,
	id string,
	scale string,
	isColor string,
	price string,
) error {
	var query = "update sponsor_styles set scale = '" + scale + "' , is_color = " + isColor + ", price = " + price + " where id = " + id
	return ssr.abstract.UpdateDB(c, query)
}

// 削除
func (ssr *sponsorStyleRepository) Delete(
	c context.Context,
	id string,
) error {
	query := "Delete from sponsor_styles where id =" + id
	return ssr.abstract.UpdateDB(c, query)
}
