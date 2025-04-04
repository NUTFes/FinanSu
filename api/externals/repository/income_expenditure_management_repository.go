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
	All(context.Context) (*sql.Rows, error)
}

func NewIncomeExpenditureManagementRepository(c db.Client, ac abstract.Crud) IncomeExpenditureManagementRepository {
	return &incomeExpenditureManagementRepository{c, ac}
}

// 全件取得
func (ier *incomeExpenditureManagementRepository) All(c context.Context) (*sql.Rows, error) {
	ds := dialect.Select("*").From("income_expenditure_managements").Order(goqu.I("income_expenditure_managements.created_at").Desc())
	query, _, err := ds.ToSQL()
	if err != nil {
		return nil, err
	}
	return ier.crud.Read(c, query)
}
