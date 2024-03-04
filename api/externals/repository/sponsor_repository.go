package repository

import (
	"context"
	"database/sql"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
)

type sponsorRepository struct {
	client db.Client
	crud   abstract.Crud
}

type SponsorRepository interface {
	All(context.Context) (*sql.Rows, error)
	Find(context.Context, string) (*sql.Row, error)
	Create(context.Context, string, string, string, string, string) error
	Update(context.Context, string, string, string, string, string, string) error
	Delete(context.Context, string) error
	FindLatestRecord(context.Context) (*sql.Row, error)
	AllByPeriod(context.Context, string) (*sql.Rows, error)
}

func NewSponsorRepository(c db.Client, ac abstract.Crud) SponsorRepository {
	return &sponsorRepository{c, ac}
}

// 全件取得
func (sr *sponsorRepository) All(c context.Context) (*sql.Rows, error) {
	query := "SELECT * FROM sponsors"
	return sr.crud.Read(c, query)
}

// 1件取得
func (sr *sponsorRepository) Find(c context.Context, id string) (*sql.Row, error) {
	query := "SELECT * FROM sponsors WHERE id = " + id
	return sr.crud.ReadByID(c, query)
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
	query := `
		INSERT  INTO
			sponsors (name, tel, email, address, representative)
		VALUES ("` + name + `","` + tel + `","` + email + `","` + address + `","` + representative + `")`
	return sr.crud.UpdateDB(c, query)
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
	query := `
		UPDATE
			sponsors
		SET
			name = "` + name +
		`", tel="` + tel +
		`", email = "` + email +
		`", address = "` + address +
		`", representative = "` + representative +
		`" WHERE id = ` + id
	return sr.crud.UpdateDB(c, query)
}

// 削除
func (sr *sponsorRepository) Delete(
	c context.Context,
	id string,
) error {
	query := "DELETE FROM sponsors WHERE id =" + id
	return sr.crud.UpdateDB(c, query)

}

// 最新のsponcerを取得する
func (sr *sponsorRepository) FindLatestRecord(c context.Context) (*sql.Row, error) {
	query := `SELECT * FROM sponsors ORDER BY id DESC LIMIT 1`
	return sr.crud.ReadByID(c, query)
}

// 年度別に取得
func (sr *sponsorRepository) AllByPeriod(c context.Context, year string) (*sql.Rows, error) {
	query := `
	SELECT
		sponsors.*
	FROM
		sponsors
	INNER JOIN
		year_periods
	ON
		sponsors.created_at > year_periods.started_at
	AND
		sponsors.created_at < year_periods.ended_at
	INNER JOIN
		years
	ON
		year_periods.year_id = years.id
	WHERE
		years.year = ` + year +
		" ORDER BY sponsors.id;"
	return sr.crud.Read(c, query)
}
