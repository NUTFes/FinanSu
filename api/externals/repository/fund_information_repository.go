package repository

import (
	"context"
	"database/sql"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
	goqu "github.com/doug-martin/goqu/v9"
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
	AllDetailsByPeriod(context.Context, string) (*sql.Rows, error)
	AllBuildingsByPeriod(context.Context, string) (*sql.Rows, error)
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
		",'" + receivedAt + "')"
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
func (fir *fundInformationRepository) AllDetailsByPeriod(c context.Context, year string) (*sql.Rows, error) {
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
		" ORDER BY fund_informations.updated_at DESC;"
	return fir.crud.Read(c, query)
}

func (fir *fundInformationRepository) AllBuildingsByPeriod(c context.Context, year string) (*sql.Rows, error) {

	db := goqu.Dialect("mysql")

	ds := db.From("fund_informations").
		Select(
			goqu.I("buildings.id"),
			goqu.I("buildings.name"),
			goqu.I("fund_informations.price"),
		).
		Join(goqu.T("teachers"), goqu.On(goqu.Ex{
			"fund_informations.teacher_id": goqu.I("teachers.id"),
		})).
		Join(goqu.T("users"), goqu.On(goqu.Ex{
			"fund_informations.user_id": goqu.I("users.id"),
		})).
		Join(goqu.T("departments"), goqu.On(goqu.Ex{
			"teachers.department_id": goqu.I("departments.id"),
		})).
		Join(goqu.T("room_teachers"), goqu.On(goqu.Ex{
			"room_teachers.teacher_id": goqu.I("teachers.id"),
		})).
		Join(goqu.T("rooms"), goqu.On(goqu.Ex{
			"room_teachers.room_id": goqu.I("rooms.id"),
		})).
		Join(goqu.T("floors"), goqu.On(goqu.Ex{
			"rooms.floor_id": goqu.I("floors.id"),
		})).
		Join(goqu.T("building_units"), goqu.On(goqu.Ex{
			"floors.building_unit_id": goqu.I("building_units.id"),
		})).
		Join(goqu.T("buildings"), goqu.On(goqu.Ex{
			"building_units.building_id": goqu.I("buildings.id"),
		})).
		Join(goqu.T("year_periods"),
			goqu.On(goqu.And(
				goqu.I("fund_informations.created_at").Gt(goqu.I("year_periods.started_at")),
				goqu.I("fund_informations.created_at").Lt(goqu.I("year_periods.ended_at")),
			)),
		).
		Join(goqu.T("years"), goqu.On(goqu.Ex{
			"year_periods.year_id": goqu.I("years.id"),
		})).
		Where(goqu.Ex{"years.year": year}).
		Order(goqu.I("fund_informations.updated_at").Desc())

	query, _, err := ds.ToSQL()
	if err != nil {
		panic(err)
	}

	return fir.crud.Read(c, query)
}
