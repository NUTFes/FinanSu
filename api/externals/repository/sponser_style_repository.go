package repository

import(
	"context"
	"database/sql"
	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/pkg/errors"
)

type sponserStyleRepository struct {
	client db.Client
}

type SponserStyleRepository interface {
	All(context.Context) (*sql.Rows, error)
	Find(context.Context, string) (*sql.Row, error)
	Create(context.Context, string, string, string) error
	Update(context.Context, string, string, string, string) error
	Delete(context.Context, string) error
}

func NewSponserRepository(client db.Client) SponserStyleRepository{
	return &sponserStyleRepository{client}
}

//全件取得
func (ssr *sponserStyleRepository) All(c context.Context) (*sql.Rows, error){
	rows , err := ssr.client.DB().QueryContext(c, "select * from sponser_styles")
	if err != nil {
		return nil, errors.Wrapf(err, "cannot connect SQL")
	}
	return rows, nil
}

//１件取得
func (ssr *sponserStyleRepository) Find(c context.Context, id string) (*sql.Row, error){
	row := ssr.client.DB().QueryRowContext(c, "select *from sponser_styles where id = " + id)
	return row, nil
}

//作成
func (ssr *sponserStyleRepository) Create(
	c context.Context,
	scale string,
	isColor string,
	price string,
)error {
	var query = "insert into sponser_styles (scale, is_color, price) values ('" + scale + "'," + isColor + "," + price + ")"
	_, err := ssr.client.DB().ExecContext(c, query)
	return err
}

//編集
func (ssr *sponserStyleRepository) Update(
	c context.Context,
	id string,
	scale string,
	isColor string,
	price string,
)error {
	var query = "update sponser_styles set scale = '" + scale + "' , is_color = " + isColor + ", price = " + price + "where id = " + id
	_, err :=ssr.client.DB().ExecContext(c, query)
	return err
}

//削除
func (ssr *sponserStyleRepository) Delete(
	c context.Context,
	id string,
)error {
	_, err := ssr.client.DB().ExecContext(c, "Delete from sponser_styles where id =" + id)
	return err
}