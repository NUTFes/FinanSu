package repository

import (
	"context"
	"database/sql"
	"strconv"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
)

type sponsorStyleRepository struct {
	client db.Client
	crud   abstract.Crud
}

type SponsorStyleRepository interface {
	All(context.Context) (*sql.Rows, error)
	Find(context.Context, string) (*sql.Row, error)
	Create(context.Context, string, string, int) error
	Update(context.Context, string, string, string, int) error
	Delete(context.Context, string) error
	FindLatestRecord(context.Context) (*sql.Row, error)
}

func NewSponsorStyleRepository(c db.Client, ac abstract.Crud) SponsorStyleRepository {
	return &sponsorStyleRepository{c, ac}
}

// 全件取得
func (ssr *sponsorStyleRepository) All(c context.Context) (*sql.Rows, error) {
	query := "SELECT * FROM sponsor_styles"
	return ssr.crud.Read(c, query)
}

// １件取得
func (ssr *sponsorStyleRepository) Find(c context.Context, id string) (*sql.Row, error) {
	query := "SELECT * FROM sponsor_styles WHERE id = " + id
	return ssr.crud.ReadByID(c, query)
}

// 作成
func (ssr *sponsorStyleRepository) Create(
	c context.Context,
	scale string,
	isColor string,
	price int,
) error {
	query := `
		INSERT INTO
			sponsor_styles (scale, is_color, price)
		VALUES ('` + scale + "'," + isColor + "," + strconv.Itoa(price) + ")"
	return ssr.crud.UpdateDB(c, query)
}

// 編集
func (ssr *sponsorStyleRepository) Update(
	c context.Context,
	id string,
	scale string,
	isColor string,
	price int,
) error {
	query := `
		UPDATE
			sponsor_styles
		SET
			scale = '` + scale +
		"' , is_color = " + isColor +
		", price = " + strconv.Itoa(price) +
		" where id = " + id
	return ssr.crud.UpdateDB(c, query)
}

// 削除
func (ssr *sponsorStyleRepository) Delete(
	c context.Context,
	id string,
) error {
	query := "DELETE FROM sponsor_styles WHERE id =" + id
	return ssr.crud.UpdateDB(c, query)
}

func (ssr *sponsorStyleRepository) FindLatestRecord(c context.Context) (*sql.Row, error) {
	query := `SELECT * FROM sponsor_styles ORDER BY id DESC LIMIT 1`
	return ssr.crud.ReadByID(c, query)
}
