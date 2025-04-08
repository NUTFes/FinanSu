package repository

import (
	"context"
	"database/sql"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	goqu "github.com/doug-martin/goqu/v9"
)

type incomeExpenditureManagementRepository struct {
	client db.Client
	crud   abstract.Crud
}

type IncomeExpenditureManagementRepository interface {
	All(context.Context, string) (*sql.Rows, error)
	UpdateChecked(context.Context, string, bool) error
	CreateIncomeExpenditureManagement(context.Context, *sql.Tx, domain.IncomeExpenditureManagementTableColumn) (*int, error)
	GetIncomeExpenditureManagementByID(context.Context, string) (*sql.Row, error)
	UpdateIncomeExpenditureManagement(context.Context, *sql.Tx, string, domain.IncomeExpenditureManagementTableColumn) error
	DeleteIncomeExpenditureManagementByID(context.Context, string) error
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
	if err != nil {
		return err
	}
	return ier.crud.UpdateDB(c, query)
}

// 新規作成
func (ier *incomeExpenditureManagementRepository) CreateIncomeExpenditureManagement(c context.Context, tx *sql.Tx, incomeExpenditureManagement domain.IncomeExpenditureManagementTableColumn) (*int, error) {
	var id *int
	ds := dialect.Insert("income_expenditure_managements").
		Rows(
			goqu.Record{
				"amount":         incomeExpenditureManagement.Amount,
				"log_category":   incomeExpenditureManagement.LogCategory,
				"year_id":        incomeExpenditureManagement.YearID,
				"receive_option": incomeExpenditureManagement.ReceiveOption,
				"is_checked":     incomeExpenditureManagement.IsChecked,
			},
		)

	query, _, err := ds.ToSQL()
	if err != nil {
		return id, err
	}

	if err := ier.crud.TransactionExec(c, tx, query); err != nil {
		return id, err
	}
	// last_insert_idを,mysqlの変数に格納
	setQuery := "SET @new_income_expenditure_managements_id = last_insert_id();"
	err = ier.crud.TransactionExec(c, tx, setQuery)
	if err != nil {
		return id, err
	}
	row, err := ier.crud.TransactionReadByID(c, tx, "SELECT @new_income_expenditure_managements_id")
	if err != nil {
		return id, err
	}
	err = row.Scan(&id)
	if err != nil {
		return id, err
	}
	return id, nil
}

// IDで取得
func (ier *incomeExpenditureManagementRepository) GetIncomeExpenditureManagementByID(c context.Context, id string) (*sql.Row, error) {
	ds := dialect.From("income_expenditure_managements").Select(
		goqu.I("income_expenditure_managements.id").As("id"),
		goqu.I("income_expenditure_managements.amount").As("amount"),
		goqu.I("income_income_expenditure_managements.income_id").As("income_id"),
		goqu.I("income_expenditure_managements.year_id").As("year_id"),
		goqu.COALESCE(goqu.I("income_expenditure_managements.receive_option"), "").As("receive_option"),
		goqu.I("spot_sponsor_names.sponsor_name").As("sponsor_name"),
	).LeftJoin(
		goqu.I("income_income_expenditure_managements"),
		goqu.On(goqu.I("income_expenditure_managements.id").Eq(goqu.I("income_income_expenditure_managements.income_expenditure_id"))),
	).LeftJoin(
		goqu.I("spot_sponsor_names"),
		goqu.On(goqu.I("spot_sponsor_names.income_expenditure_id").Eq(goqu.I("income_expenditure_managements.id"))),
	).Where(
		goqu.Ex{
			"income_expenditure_managements.id": id,
		},
	).Limit(1)
	query, _, err := ds.ToSQL()
	if err != nil {
		return nil, err
	}
	return ier.crud.ReadByID(c, query)
}

// IDで更新
func (ier *incomeExpenditureManagementRepository) UpdateIncomeExpenditureManagement(c context.Context, tx *sql.Tx, incomeExpenditureManagementID string, incomeExpenditureManagement domain.IncomeExpenditureManagementTableColumn) error {
	ds := dialect.Update("income_expenditure_managements").
		Set(goqu.Record{
			"amount":         incomeExpenditureManagement.Amount,
			"log_category":   incomeExpenditureManagement.LogCategory,
			"year_id":        incomeExpenditureManagement.YearID,
			"receive_option": incomeExpenditureManagement.ReceiveOption,
		}).
		Where(goqu.Ex{"id": incomeExpenditureManagementID})

	query, _, err := ds.ToSQL()
	if err != nil {
		return err
	}
	return ier.crud.TransactionExec(c, tx, query)
}

// IDで削除
func (ier *incomeExpenditureManagementRepository) DeleteIncomeExpenditureManagementByID(c context.Context, id string) error {
	ds := dialect.Delete("income_expenditure_managements").
		Where(goqu.Ex{"id": id})

	query, _, err := ds.ToSQL()
	if err != nil {
		return err
	}
	return ier.crud.UpdateDB(c, query)
}

var selectIncomeExpenditureManagementQuery = dialect.From("income_expenditure_managements").
	Select(
		goqu.I("income_expenditure_managements.id").As("id"),
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
		goqu.COALESCE(goqu.I("income_expenditure_managements.receive_option"), ""),
		goqu.I("income_expenditure_managements.is_checked").As("is_checked"),
	).
	Join(goqu.I("years"), goqu.On(goqu.I("income_expenditure_managements.year_id").Eq(goqu.I("years.id")))).
	LeftJoin(
		goqu.I("income_income_expenditure_managements"),
		goqu.On(goqu.I("income_expenditure_managements.id").Eq(goqu.I("income_income_expenditure_managements.income_expenditure_id"))),
	).
	LeftJoin(
		goqu.I("incomes"),
		goqu.On(goqu.I("income_income_expenditure_managements.income_id").Eq(goqu.I("incomes.id"))),
	).
	LeftJoin(
		goqu.I("buy_report_income_expenditure_managements"),
		goqu.On(goqu.I("income_expenditure_managements.id").Eq(goqu.I("buy_report_income_expenditure_managements.income_expenditure_management_id"))),
	).
	LeftJoin(
		goqu.I("buy_reports"),
		goqu.On(goqu.I("buy_report_income_expenditure_managements.buy_report_id").Eq(goqu.I("buy_reports.id"))),
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
