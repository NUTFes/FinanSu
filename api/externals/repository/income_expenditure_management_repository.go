package repository

import (
	"context"
	"database/sql"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
	goqu "github.com/doug-martin/goqu/v9"
)

type incomeExpenditureManagementRepository struct {
	client db.Client
	crud   abstract.Crud
}

type IncomeExpenditureManagementRepository interface {
	All(context.Context, string) (*sql.Rows, error)
}

func NewIncomeExpenditureManagementRepository(c db.Client, ac abstract.Crud) IncomeExpenditureManagementRepository {
	return &incomeExpenditureManagementRepository{c, ac}
}

// 全件取得
func (ier *incomeExpenditureManagementRepository) All(c context.Context, year string) (*sql.Rows, error) {
	ds := selectIncomeExpenditureManagementQuery
	if year != "" {
		ds = ds.Where(goqu.Ex{"year": year})
	}
	query, _, err := ds.ToSQL()
	if err != nil {
		return nil, err
	}
	return ier.crud.Read(c, query)
}

var selectIncomeExpenditureManagementQuery = dialect.From("income_expenditure_managements").
	Select(
		goqu.I("income_expenditure_managements.created_at").As("date"),
		goqu.I("income_expenditure_managements.content").As("content"),
		goqu.Literal("''").As("detail"),
		goqu.I("income_expenditure_managements.amount").As("amount"),
		goqu.I("income_expenditure_managements.log_category").As("log_category"),
		goqu.I("income_expenditure_managements.is_checked").As("is_checked"),
	).
	Join(goqu.I("years"), goqu.On(goqu.I("income_expenditure_managements.year_id").Eq(goqu.I("years.id")))).
	Order(goqu.I("income_expenditure_managements.created_at").Desc())
