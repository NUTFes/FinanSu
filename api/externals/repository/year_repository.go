package repository

import (
	"context"
	"database/sql"
	"strconv"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
)

type yearRepository struct {
	client db.Client
	crud   abstract.Crud
}

type YearRepository interface {
	All(context.Context) (*sql.Rows, error)
	Find(context.Context, string) (*sql.Row, error)
	Create(context.Context, string) error
	Update(context.Context, string, string) error
	Destroy(context.Context, string) error
	FindLatestRecord(context.Context) (*sql.Row, error)
	AllYearPeriods(context.Context) (*sql.Rows, error)
	CreateYearPeriod(context.Context, string, string, string) error
	FindPeriodLatestRecord(context.Context) (*sql.Row, error)
	FindYearPeriodByID(context.Context, string) (*sql.Row, error)
	UpdateYearPeriod(context.Context, string, string, string, string) error
	DestroyYearPeriod(context.Context, string) error
}

func NewYearRepository(c db.Client, ac abstract.Crud) YearRepository {
	return &yearRepository{c, ac}
}

func (y *yearRepository) All(c context.Context) (*sql.Rows, error) {
	query := "SELECT * FROM years"
	return y.crud.Read(c, query)
}

func (y *yearRepository) Find(c context.Context, id string) (*sql.Row, error) {
	query := "SELECT * FROM years WHERE id = " + id
	return y.crud.ReadByID(c, query)
}

func (y *yearRepository) Create(c context.Context, year string) error {
	query := `INSERT INTO years (year) VALUES (` + year + ")"
	return y.crud.UpdateDB(c, query)
}

func (y *yearRepository) Update(c context.Context, id string, year string) error {
	query := `UPDATE years SET year =` + year + " WHERE id = " + id
	return y.crud.UpdateDB(c, query)
}

func (y *yearRepository) Destroy(c context.Context, id string) error {
	query := "DELETE FROM years WHERE id = " + id
	return y.crud.UpdateDB(c, query)
}

func (y *yearRepository) FindLatestRecord(c context.Context) (*sql.Row, error) {
	query := `SELECT * FROM years ORDER BY id DESC LIMIT 1`
	return y.crud.ReadByID(c, query)
}

func (y *yearRepository) FindPeriodLatestRecord(c context.Context) (*sql.Row, error) {
	query := `
		SELECT
			years.id,
			years.year,
			year_periods.started_at,
			year_periods.ended_at,
			year_periods.created_at,
			year_periods.updated_at
		FROM
			years
		INNER JOIN
			year_periods
		ON
			years.id = year_periods.year_id
		ORDER BY
			year_periods.id
		DESC LIMIT 1`
	return y.crud.ReadByID(c, query)
}

func (y *yearRepository) AllYearPeriods(c context.Context) (*sql.Rows, error) {
	query := `
		SELECT
			year_periods.id,
			years.year,
			year_periods.started_at,
			year_periods.ended_at,
			year_periods.created_at,
			year_periods.updated_at
		FROM
			years
		INNER JOIN
			year_periods
		ON
			years.id = year_periods.year_id`
	return y.crud.Read(c, query)
}

func (y *yearRepository) CreateYearPeriod(c context.Context, year string, startedAt string, endedAt string) error {
	query := `INSERT INTO years (year) SELECT ` + year + ` WHERE NOT EXISTS ( SELECT *  FROM years WHERE year = ` + year + ` );`
	err := y.crud.UpdateDB(c, query)
	if err != nil {
		return err
	}
	query = `SELECT id FROM years WHERE year = ` + year + `;`
	row, err := y.crud.ReadByID(c, query)
	if err != nil {
		return err
	}
	id := 0
	err = row.Scan(
		&id,
	)
	if err != nil {
		return err
	}
	query = `
		INSERT INTO
			year_periods
			(year_id, started_at, ended_at)
		VALUES
			(` + strconv.Itoa(id) + ", '" + startedAt + "', '" + endedAt + "');"
	return y.crud.UpdateDB(c, query)
}

func (y *yearRepository) UpdateYearPeriod(c context.Context, id string, year string, startedAt string, endedAt string) error {
	query := `INSERT INTO years (year) SELECT ` + year + ` WHERE NOT EXISTS ( SELECT *  FROM years WHERE year = ` + year + ` );`
	err := y.crud.UpdateDB(c, query)
	if err != nil {
		return err
	}
	query = `SELECT id FROM years WHERE year = ` + year + ";"
	row, err := y.crud.ReadByID(c, query)
	if err != nil {
		return err
	}
	last_id := 0
	err = row.Scan(
		&last_id,
	)
	if err != nil {
		return err
	}
	query = `
		UPDATE
			year_periods
		SET
			year_id = ` + strconv.Itoa(last_id) +
		", started_at = '" + startedAt +
		"', ended_at = '" + endedAt +
		"' WHERE id = " + id + `;`
	return y.crud.UpdateDB(c, query)
}

func (y *yearRepository) FindYearPeriodByID(c context.Context, id string) (*sql.Row, error) {
	query := `
		SELECT
			year_periods.id,
			years.year,
			year_periods.started_at,
			year_periods.ended_at,
			year_periods.created_at,
			year_periods.updated_at
		FROM
			years
		INNER JOIN
			year_periods
		ON
			years.id = year_periods.year_id
		WHERE year_periods.id = ` + id + `;`
	return y.crud.ReadByID(c, query)
}

func (y *yearRepository) DestroyYearPeriod(c context.Context, id string) error {
	query := "DELETE FROM year_periods WHERE id = " + id
	return y.crud.UpdateDB(c, query)
}
