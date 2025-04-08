package repository

import (
	"context"
	"database/sql"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
	"github.com/doug-martin/goqu/v9"
)

type incomeRepository struct {
	client db.Client
	crud   abstract.Crud
}

type IncomeRepository interface {
	All(context.Context) (*sql.Rows, error)
	CreateIncome(context.Context, *sql.Tx, string, string) error
	CreateSponsorName(context.Context, *sql.Tx, string, string) error
}

func NewIncomeRepository(c db.Client, ac abstract.Crud) IncomeRepository {
	return &incomeRepository{c, ac}
}

func (r *incomeRepository) All(ctx context.Context) (*sql.Rows, error) {
	ds := dialect.From("incomes").Select("id", "name")

	query, _, err := ds.ToSQL()
	if err != nil {
		return nil, err
	}
	rows, err := r.crud.Read(ctx, query)
	if err != nil {
		return nil, err
	}
	return rows, nil
}

func (r *incomeRepository) CreateIncome(ctx context.Context, tx *sql.Tx, incomeItemID, incomeExpenditureManagementID string) error {
	ds := dialect.Insert("income_income_expenditure_managements").Rows(
		goqu.Record{"income_id": incomeItemID, "income_expenditure_id": incomeExpenditureManagementID},
	)

	query, _, err := ds.ToSQL()
	if err != nil {
		return err
	}

	return r.crud.TransactionExec(ctx, tx, query)
}

func (r *incomeRepository) CreateSponsorName(ctx context.Context, tx *sql.Tx, incomeExpenditureManagementID, sponsorName string) error {
	ds := dialect.Insert("spot_sponsor_names").Rows(
		goqu.Record{"income_expenditure_id": incomeExpenditureManagementID, "sponsor_name": sponsorName},
	)

	query, _, err := ds.ToSQL()
	if err != nil {
		return err
	}

	return r.crud.TransactionExec(ctx, tx, query)
}
