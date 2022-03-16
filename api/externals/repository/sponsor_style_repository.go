package repository

import(
	"context"
	"database/sql"
	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/pkg/errors"
)

type sponsorStyleRepository struct {
	client db.Client
}

type SponsorStyleRepository interface {
	All(context.Context) (*sql.Rows, error)
	Find(context.Context, string) (*sql.Row, error)
	Create(context.Context, string, string, string) error
	Update(context.Context, string, string, string, string) error
	Delete(context.Context, string) error
}

func NewSponsorStyleRepository(client db.Client) SponsorStyleRepository{
	return &sponsorStyleRepository{client}
}

//全件取得
func (ssr *sponsorStyleRepository) All(c context.Context) (*sql.Rows, error){
	rows , err := ssr.client.DB().QueryContext(c, "select * from sponsor_styles")
	if err != nil {
		return nil, errors.Wrapf(err, "cannot connect SQL")
	}
	return rows, nil
}

//１件取得
func (ssr *sponsorStyleRepository) Find(c context.Context, id string) (*sql.Row, error){
	row := ssr.client.DB().QueryRowContext(c, "select *from sponsor_styles where id = " + id)
	return row, nil
}

//作成
func (ssr *sponsorStyleRepository) Create(
	c context.Context,
	scale string,
	isColor string,
	price string,
)error {
	var query = "insert into sponsor_styles (scale, is_color, price) values ('" + scale + "'," + isColor + "," + price + ")"
	_, err := ssr.client.DB().ExecContext(c, query)
	return err
}

//編集
func (ssr *sponsorStyleRepository) Update(
	c context.Context,
	id string,
	scale string,
	isColor string,
	price string,
)error {
	var query = "update sponsor_styles set scale = '" + scale + "' , is_color = " + isColor + ", price = " + price + " where id = " + id
	_, err :=ssr.client.DB().ExecContext(c, query)
	return err
}

//削除
func (ssr *sponsorStyleRepository) Delete(
	c context.Context,
	id string,
)error {
	_, err := ssr.client.DB().ExecContext(c, "Delete from sponsor_styles where id =" + id)
	return err
}