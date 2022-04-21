package repository

import (
	"context"
	"database/sql"
	"github.com/NUTFes/FinanSu/api/drivers/db"
)

type fundInformationRepository struct {
	client db.Client
}

type FundInformationRepository interface {
	All(context.Context) (*sql.Rows, error)
	Find(context.Context, string) (*sql.Row, error)
	Create(context.Context, string, string, string, string, string, string) error
	Update(context.Context, string, string, string, string, string, string, string) error
	Delete(context.Context, string) error
	AllWithUAndT(context.Context) (*sql.Rows, error)
	FindWithUAndT(context.Context, string) (*sql.Row, error)
}

func NewFundInformationRepository(client db.Client) FundInformationRepository {
	return &fundInformationRepository{client}
}

// 全件取得
func (fir *fundInformationRepository) All(c context.Context) (*sql.Rows, error) {
	rows, err := fir.client.DB().QueryContext(c, "select * from fund_informations")
	if err != nil {
		return nil, err
	}
	return rows, nil
}

// 1件取得
func (fir *fundInformationRepository) Find(c context.Context, id string) (*sql.Row, error) {
	row := fir.client.DB().QueryRowContext(c, "select * from fund_informations where id = "+id)
	return row, nil
}

// 作成
func (fir *fundInformationRepository) Create(
	c context.Context,
	userID string,
	teacherID string,
	price string,
	remark string,
	isFirstCheck string,
	isLastCheck string,
) error {
	var query = "insert into fund_informations (user_id, teacher_id, price, remark, is_first_check, is_last_check) values ( " + userID + "," + teacherID + "," + price + ",'" + remark + "'," + isFirstCheck + "," + isLastCheck + ")"
	_, err := fir.client.DB().ExecContext(c, query)
	return err
}

// 編集
func (fir *fundInformationRepository) Update(
	c context.Context,
	id string,
	userID string,
	teacherID string,
	price string,
	remark string,
	isFirstCheck string,
	isLastCheck string,
) error {
	var query = "update fund_informations set user_id = " + userID + " , teacher_id = " + teacherID + ", price = " + price + ", remark ='" + remark + "', is_first_check = " + isFirstCheck + ", is_last_check = " + isLastCheck + " where id = " + id
	_, err := fir.client.DB().ExecContext(c, query)
	return err
}

//削除
func (fir *fundInformationRepository) Delete(c context.Context, id string) error {
	_, err := fir.client.DB().ExecContext(c, "Delete from fund_informations where id = "+id)
	return err
}

//fund_information-API
func (fir *fundInformationRepository) AllWithUAndT(c context.Context) (*sql.Rows, error) {
	rows , err := fir.client.DB().QueryContext(c,"select * from fund_informations inner join users on fund_informations.user_id = users.id inner join teachers on fund_informations.teacher_id = teachers.id;")
	if err != nil {
		return nil, err
	}
	return rows, nil
}

//fund_infonformaton-API-ByID
func (fir *fundInformationRepository) FindWithUAndT(c context.Context, id string) (*sql.Row, error) {
	row:= fir.client.DB().QueryRowContext(c, "select * from fund_informations inner join users on fund_informations.user_id = users.id inner join teachers on fund_informations.teacher_id = teachers.id where fund_informations.id = " + id)
	return row, nil
}