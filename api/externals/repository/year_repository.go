package repository

import (
	"context"
	"database/sql"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
)

type yearRepository struct {
	client   db.Client
	abstract abstract.Crud
}

type YearRepository interface {
	All(context.Context) (*sql.Rows, error)
	Find(context.Context, string) (*sql.Row, error)
	Create(context.Context, string) error
	Update(context.Context, string, string) error
	Destroy(context.Context, string) error
	FindLatestRecord(context.Context) (*sql.Row, error)
}

func NewYearRepository(c db.Client, ac abstract.Crud) YearRepository {
	return &yearRepository{c, ac}
}

func (y *yearRepository) All(c context.Context) (*sql.Rows, error) {
	query := "SELECT * FROM years"
	return y.abstract.Read(c, query)
}

func (y *yearRepository) Find(c context.Context, id string) (*sql.Row, error) {
	query := "SELECT * FROM years WHERE id = " + id
	return y.abstract.ReadByID(c, query)
}

func (y *yearRepository) Create(c context.Context, year string) error {
	query := `INSERT INTO years (year) VALUES (` + year + ")"
	return y.abstract.UpdateDB(c, query)
}

func (y *yearRepository) Update(c context.Context, id string, year string) error {
	query := `UPDATE years SET year =` + year + " WHERE id = " + id
	return y.abstract.UpdateDB(c, query)
}

func (y *yearRepository) Destroy(c context.Context, id string) error {
	query := "DELETE FROM years WHERE id = " + id
	return y.abstract.UpdateDB(c, query)
}

func (y *yearRepository) FindLatestRecord(c context.Context) (*sql.Row, error) {
	query := `SELECT * FROM years ORDER BY id DESC LIMIT 1`
	return y.abstract.ReadByID(c, query)
}
