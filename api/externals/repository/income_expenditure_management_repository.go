package repository

import (
	"context"
	"database/sql"
	"fmt"

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
	UpdateChecked(context.Context, string, bool) error
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

// checkedの更新
func (ier *incomeExpenditureManagementRepository) UpdateChecked(c context.Context, id string, isChecked bool) error {
	ds := dialect.Update("income_expenditure_managements").
		Set(goqu.Record{"is_checked": isChecked}).
		Where(goqu.Ex{"id": id})

	query, _, err := ds.ToSQL()
	fmt.Println(query)
	if err != nil {
		return err
	}
	return ier.crud.UpdateDB(c, query)
}

var selectIncomeExpenditureManagementQuery = dialect.From("income_expenditure_managements").
	Select(
		goqu.I("income_expenditure_managements.created_at").As("date"),
		goqu.COALESCE(
			goqu.COALESCE(goqu.I("incomes.name"), goqu.I("financial_records.name")),
			"",
		).As("content"),
		goqu.COALESCE(
			goqu.COALESCE(goqu.I("festival_items.name"), goqu.I("spot_sponsor_names.sponsor_name")),
			"",
		).As("detail"),
		goqu.I("income_expenditure_managements.amount").As("amount"),
		goqu.I("income_expenditure_managements.log_category").As("log_category"),
		goqu.I("income_expenditure_managements.is_checked").As("is_checked"),
	).
	Join(goqu.I("years"), goqu.On(goqu.I("income_expenditure_managements.year_id").Eq(goqu.I("years.id")))).
	LeftJoin(
		goqu.I("income_expenditure_links"),
		goqu.On(goqu.I("income_expenditure_managements.id").Eq(goqu.I("income_expenditure_links.income_expenditure_id"))),
	).
	LeftJoin(
		goqu.I("incomes"),
		goqu.On(goqu.I("income_expenditure_links.income_id").Eq(goqu.I("incomes.id"))),
	).
	LeftJoin(
		goqu.I("buy_report_balance_managements"),
		goqu.On(goqu.I("income_expenditure_managements.id").Eq(goqu.I("buy_report_balance_managements.income_expenditure_management_id"))),
	).
	LeftJoin(
		goqu.I("buy_reports"),
		goqu.On(goqu.I("buy_report_balance_managements.buy_report_id").Eq(goqu.I("buy_reports.id"))),
	).
	LeftJoin(
		goqu.I("festival_items"),
		goqu.On(goqu.I("buy_reports.festival_item_id").Eq(goqu.I("festival_items.id"))),
	).
	LeftJoin(
		goqu.I("divisions"),
		goqu.On(goqu.I("festival_items.division_id").Eq(goqu.I("divisions.id"))),
	).
	LeftJoin(
		goqu.I("financial_records"),
		goqu.On(goqu.I("divisions.financial_record_id").Eq(goqu.I("financial_records.id"))),
	).
	LeftJoin(
		goqu.I("spot_sponsor_names"),
		goqu.On(goqu.I("spot_sponsor_names.income_expenditure_id").Eq(goqu.I("income_expenditure_managements.id"))),
	).
	Order(goqu.I("income_expenditure_managements.created_at").Desc())
