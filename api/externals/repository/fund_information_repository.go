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
	Create(context.Context, string, string, string, string, string, string, string) error
	Update(context.Context, string, string, string, string, string, string, string, string) error
	Delete(context.Context, string) error
	FindDetails(context.Context) (*sql.Rows, error)
	FindDetailByID(context.Context, string) (*sql.Row, error)
	FindLatestRecord(context.Context) (*sql.Row, error)
	AllDetailsForPeriods(context.Context, string) (*sql.Rows, error)
}

func NewFundInformationRepository(c db.Client, ac abstract.Crud) FundInformationRepository {
	return &fundInformationRepository{c, ac}
}

// 全件取得
func (fir *fundInformationRepository) All(c context.Context) (*sql.Rows, error) {
	query := `SELECT * FROM fund_informations`
	return fir.crud.Read(c, query)
}

// 1件取得
func (fir *fundInformationRepository) Find(c context.Context, id string) (*sql.Row, error) {
	query := `SELECT * FROM fund_informations WHERE id =` + id
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
	receivedAt string,
) error {
	query := `
		INSERT INTO
			fund_informations(
				user_id,
				teacher_id,
				price, remark,
				is_first_check,
				is_last_check,
				received_at
			) VALUES (
				` + userID +
				"," + teacherID +
				"," + price +
				",'" + remark +
				"'," + isFirstCheck +
				"," + isLastCheck +
				"," + receivedAt + ")"
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
	receivedAt string,
) error {
	query := `
		UPDATE
			fund_informations
		SET
			user_id = ` + userID +
		", teacher_id =  " + teacherID +
		", price = " + price +
		", remark ='" + remark +
		"', is_first_check = " + isFirstCheck +
		", is_last_check = " + isLastCheck +
		", received_at = " + receivedAt +
		" WHERE id = " + id
	return fir.crud.UpdateDB(c, query)
}

// 削除
func (fir *fundInformationRepository) Delete(c context.Context, id string) error {
	query := "DELETE FROM fund_informations WHERE id = " + id
	return fir.crud.UpdateDB(c, query)
}

// fund_informationに紐づくuserとteacherを全件取得する
func (fir *fundInformationRepository) FindDetails(c context.Context) (*sql.Rows, error) {
	query := `
		SELECT
			*
		FROM
			fund_informations
		INNER JOIN
			users
		ON
			fund_informations.user_id = users.id
		INNER JOIN
			teachers
		ON
			fund_informations.teacher_id = teachers.id
		INNER JOIN
			departments
		ON
			teachers.department_id = departments.id;`
	return fir.crud.Read(c, query)
}

// IDを指定してfund_informationに紐づくuserとteacherを取得する
func (fir *fundInformationRepository) FindDetailByID(c context.Context, id string) (*sql.Row, error) {
	query := `
		SELECT
			*
		FROM
			fund_informations
		INNER JOIN
			users
		ON
			fund_informations.user_id = users.id
		INNER JOIN
			teachers
		ON
			fund_informations.teacher_id = teachers.id
		INNER JOIN
			departments
		ON
			teachers.department_id = departments.id
		WHERE fund_informations.id = ` + id
	return fir.crud.ReadByID(c, query)
}

// 最新のfund_informationを取得する
func (fir *fundInformationRepository) FindLatestRecord(c context.Context) (*sql.Row, error) {
	query := `
		SELECT
			*
		FROM
			fund_informations
		ORDER BY
			id
		DESC LIMIT 1
	`
	return fir.crud.ReadByID(c, query)
}

// 年度別のfund_informationに紐づくuserとteacherを取得する
func (fir *fundInformationRepository) AllDetailsForPeriods(c context.Context, year string) (*sql.Rows, error) {
	query := `
		SELECT
			fund_informations.*,
			users.*,
			teachers.*,
			departments.*
		FROM
			fund_informations
		INNER JOIN
			users
		ON
			fund_informations.user_id = users.id
		INNER JOIN
			teachers
		ON
			fund_informations.teacher_id = teachers.id
		INNER JOIN
			departments
		ON
			teachers.department_id = departments.id
		INNER JOIN
			year_periods
		ON
			fund_informations.created_at > year_periods.started_at
		AND
			fund_informations.created_at < year_periods.ended_at
		INNER JOIN
			years
		ON
			year_periods.year_id = years.id
		WHERE
			years.year = ` + year +
			" ORDER BY fund_informations.id;"
	return fir.crud.Read(c, query)
}
