package repository

import (
	"context"
	"database/sql"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
)

type fundInformationRepository struct {
	client db.Client
	crud   abstract.Crud
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

func NewFundInformationRepository(c db.Client, ac abstract.Crud) FundInformationRepository {
	return &fundInformationRepository{c, ac}
}

// 全件取得
func (fir *fundInformationRepository) All(c context.Context) (*sql.Rows, error) {
	query := "select * from fund_informations"
	return fir.crud.Read(c, query)
}

// 1件取得
func (fir *fundInformationRepository) Find(c context.Context, id string) (*sql.Row, error) {
	query := "select * from fund_informations where id = " + id
	return fir.crud.ReadByID(c, query)
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
	return fir.crud.UpdateDB(c, query)
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
	return fir.crud.UpdateDB(c, query)
}

// 削除
func (fir *fundInformationRepository) Delete(c context.Context, id string) error {
	query := "Delete from fund_informations where id = " + id
	return fir.crud.UpdateDB(c, query)
}

// fund_information-API
func (fir *fundInformationRepository) AllWithUAndT(c context.Context) (*sql.Rows, error) {
	query := "select * from fund_informations inner join users on fund_informations.user_id = users.id inner join teachers on fund_informations.teacher_id = teachers.id;"
	return fir.crud.Read(c, query)
}

// fund_infonformaton-API-ByID
func (fir *fundInformationRepository) FindWithUAndT(c context.Context, id string) (*sql.Row, error) {
	query := "select * from fund_informations inner join users on fund_informations.user_id = users.id inner join teachers on fund_informations.teacher_id = teachers.id where fund_informations.id = " + id
	return fir.crud.ReadByID(c, query)
}
