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
	GetSponsorName(context.Context, *sql.Tx, string) (*sql.Row, error)
	CreateIncome(context.Context, *sql.Tx, string, string) error
	CreateSponsorName(context.Context, *sql.Tx, string, string) error
	UpdateIncome(context.Context, *sql.Tx, string, string) error
	UpdateSponsorName(context.Context, *sql.Tx, string, string) error
	DeleteSponsorNameByIncomeExpenditureManagementID(context.Context, *sql.Tx, string) error
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

func (r *incomeRepository) GetSponsorName(ctx context.Context, tx *sql.Tx, incomeExpenditureManagementID string) (*sql.Row, error) {
	ds := dialect.From("spot_sponsor_names").Select("sponsor_name").Where(
		goqu.Ex{"income_expenditure_id": incomeExpenditureManagementID},
	).Limit(1)
	query, _, err := ds.ToSQL()
	if err != nil {
		return nil, err
	}

	row, err := r.crud.TransactionReadByID(ctx, tx, query)
	if err != nil {
		return nil, err
	}
	return row, nil
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

func (r *incomeRepository) UpdateIncome(ctx context.Context, tx *sql.Tx, incomeExpenditureManagementID, incomeItemID string) error {
	ds := dialect.Update("income_income_expenditure_managements").Set(
		goqu.Record{"income_id": incomeItemID},
	).Where(goqu.Ex{"income_expenditure_id": incomeExpenditureManagementID})

	query, _, err := ds.ToSQL()
	if err != nil {
		return err
	}

	return r.crud.TransactionExec(ctx, tx, query)
}

func (r *incomeRepository) UpdateSponsorName(ctx context.Context, tx *sql.Tx, incomeExpenditureManagementID, sponsorName string) error {
	ds := dialect.Update("spot_sponsor_names").Set(
		goqu.Record{"sponsor_name": sponsorName},
	).Where(goqu.Ex{"income_expenditure_id": incomeExpenditureManagementID})
	query, _, err := ds.ToSQL()
	if err != nil {
		return err
	}
	return r.crud.TransactionExec(ctx, tx, query)
}

func (r *incomeRepository) DeleteSponsorNameByIncomeExpenditureManagementID(ctx context.Context, tx *sql.Tx, incomeExpenditureManagementID string) error {
	ds := dialect.Delete("spot_sponsor_names").Where(
		goqu.Ex{"income_expenditure_id": incomeExpenditureManagementID},
	)

	query, _, err := ds.ToSQL()
	if err != nil {
		return err
	}

	return r.crud.TransactionExec(ctx, tx, query)
}
