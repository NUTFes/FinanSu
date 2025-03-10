package repository

import (
	"context"
	"database/sql"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
	"github.com/NUTFes/FinanSu/api/generated"
	goqu "github.com/doug-martin/goqu/v9"
)

type financialRecordRepository struct {
	client db.Client
	crud   abstract.Crud
}

type FinancialRecordRepository interface {
	All(context.Context) (*sql.Rows, error)
	AllByPeriod(context.Context, string) (*sql.Rows, error)
	GetById(context.Context, string) (*sql.Row, error)
	GetFinancialRecordById(context.Context, string) (*sql.Row, error)
	Create(context.Context, generated.FinancialRecord) error
	Update(context.Context, string, generated.FinancialRecord) error
	Delete(context.Context, string) error
	FindLatestRecord(context.Context) (*sql.Row, error)
	AllForCSV(context.Context, string) (*sql.Rows, error)
}

func NewFinancialRecordRepository(c db.Client, ac abstract.Crud) FinancialRecordRepository {
	return &financialRecordRepository{c, ac}
}

// 年度別に取得
func (frr *financialRecordRepository) All(
	c context.Context,
) (*sql.Rows, error) {
	query, _, err := selectFinancialRecordQuery.
		ToSQL()

	if err != nil {
		return nil, err
	}
	return frr.crud.Read(c, query)
}

// 年度別に取得
func (frr *financialRecordRepository) AllByPeriod(
	c context.Context,
	year string,
) (*sql.Rows, error) {
	query, _, err := selectFinancialRecordQuery.
		Where(goqu.Ex{"years.year": year}).
		ToSQL()
	if err != nil {
		return nil, err
	}
	return frr.crud.Read(c, query)
}

// IDで取得
func (frr *financialRecordRepository) GetById(
	c context.Context,
	id string,
) (*sql.Row, error) {
	query, _, err := selectFinancialRecordQuery.
		Where(goqu.Ex{"financial_records.id": id}).
		ToSQL()
	if err != nil {
		return nil, err
	}
	return frr.crud.ReadByID(c, query)
}

// IDでfinancial_recordsのみ取得
func (frr *financialRecordRepository) GetFinancialRecordById(
	c context.Context,
	id string,
) (*sql.Row, error) {
	query, _, err := dialect.Select("id", "name", "year_id").
		From("financial_records").
		Where(goqu.Ex{"id": id}).
		ToSQL()
	if err != nil {
		return nil, err
	}
	return frr.crud.ReadByID(c, query)
}

// 作成
func (frr *financialRecordRepository) Create(
	c context.Context,
	financialRecord generated.FinancialRecord,
) error {
	ds := dialect.Insert("financial_records").
		Rows(goqu.Record{"name": financialRecord.Name, "year_id": financialRecord.YearId})
	query, _, err := ds.ToSQL()
	if err != nil {
		return err
	}
	return frr.crud.UpdateDB(c, query)
}

// 編集
func (frr *financialRecordRepository) Update(
	c context.Context,
	id string,
	financialRecord generated.FinancialRecord,
) error {
	ds := dialect.Update("financial_records").
		Set(goqu.Record{"name": financialRecord.Name, "year_id": financialRecord.YearId}).
		Where(goqu.Ex{"id": id})
	query, _, err := ds.ToSQL()
	if err != nil {
		return err
	}
	return frr.crud.UpdateDB(c, query)
}

// 削除
func (frr *financialRecordRepository) Delete(
	c context.Context,
	id string,
) error {
	ds := dialect.Delete("financial_records").Where(goqu.Ex{"id": id})
	query, _, err := ds.ToSQL()
	if err != nil {
		return err
	}
	return frr.crud.UpdateDB(c, query)

}

// 最新のsponcerを取得する
func (frr *financialRecordRepository) FindLatestRecord(c context.Context) (*sql.Row, error) {
	query, _, err := selectFinancialRecordQuery.
		Order(goqu.I("id").Desc()).
		Limit(1).
		ToSQL()
	if err != nil {
		return nil, err
	}
	return frr.crud.ReadByID(c, query)
}

// 年度別に取得
func (frr *financialRecordRepository) AllForCSV(
	c context.Context,
	year string,
) (*sql.Rows, error) {
	ds := selectFinancialRecordQueryForCSV
	dsExceptItem := selectFinancialRecordQueryForCsvExceptItem
	if year != "" {
		ds = ds.Where(goqu.Ex{"years.year": year})
		dsExceptItem = dsExceptItem.Where(goqu.Ex{"years.year": year})
	}
	// 2つのdsをUNION
	sql := ds.Union(dsExceptItem).Order(goqu.I("id").Asc())
	query, _, err := sql.ToSQL()

	if err != nil {
		return nil, err
	}
	return frr.crud.Read(c, query)
}

var selectFinancialRecordQuery = dialect.Select(
	"financial_records.id",
	"financial_records.name", "years.year",
	goqu.COALESCE(goqu.SUM("item_budgets.amount"), 0).As("budget"),
	goqu.COALESCE(goqu.SUM("buy_reports.amount"), 0).As("expense"),
	goqu.L("COALESCE(SUM(item_budgets.amount), 0) - COALESCE(SUM(buy_reports.amount), 0)").As("balance")).
	From("financial_records").
	InnerJoin(goqu.I("years"), goqu.On(goqu.I("financial_records.year_id").Eq(goqu.I("years.id")))).
	LeftJoin(goqu.I("divisions"), goqu.On(goqu.I("financial_records.id").Eq(goqu.I("divisions.financial_record_id")))).
	LeftJoin(goqu.I("festival_items"), goqu.On(goqu.I("divisions.id").Eq(goqu.I("festival_items.division_id")))).
	LeftJoin(goqu.I("item_budgets"), goqu.On(goqu.I("festival_items.id").Eq(goqu.I("item_budgets.festival_item_id")))).
	LeftJoin(goqu.I("buy_reports"), goqu.On(goqu.I("festival_items.id").Eq(goqu.I("buy_reports.festival_item_id")))).
	GroupBy("financial_records.id")

// 予算・部門がないものを取得するds
var selectFinancialRecordQueryForCSV = dialect.Select(
	"financial_records.id",
	"financial_records.name",
	"divisions.name",
	"festival_items.name",
	goqu.COALESCE(goqu.SUM("item_budgets.amount"), 0).As("budget"),
	goqu.COALESCE(goqu.SUM("buy_reports.amount"), 0).As("expense")).
	From("festival_items").
	InnerJoin(goqu.I("divisions"), goqu.On(goqu.I("festival_items.division_id").Eq(goqu.I("divisions.id")))).
	InnerJoin(goqu.I("financial_records"), goqu.On(goqu.I("divisions.financial_record_id").Eq(goqu.I("financial_records.id")))).
	InnerJoin(goqu.I("years"), goqu.On(goqu.I("financial_records.year_id").Eq(goqu.I("years.id")))).
	LeftJoin(goqu.I("item_budgets"), goqu.On(goqu.I("festival_items.id").Eq(goqu.I("item_budgets.festival_item_id")))).
	LeftJoin(goqu.I("buy_reports"), goqu.On(goqu.I("festival_items.id").Eq(goqu.I("buy_reports.festival_item_id")))).GroupBy("festival_items.id")

// 予算・部門がないものを取得するds
var selectFinancialRecordQueryForCsvExceptItem = dialect.Select(
	"financial_records.id",
	"financial_records.name",
	goqu.COALESCE(goqu.I("divisions.name"), "").As("divisionName"),
	goqu.L("''").As("festivalItemName"),
	goqu.L("0").As("budget"),
	goqu.L("0").As("expense")).
	From("financial_records").
	LeftJoin(goqu.I("divisions"), goqu.On(goqu.I("divisions.financial_record_id").Eq(goqu.I("financial_records.id")))).
	InnerJoin(goqu.I("years"), goqu.On(goqu.I("financial_records.year_id").Eq(goqu.I("years.id")))).
	Where(goqu.Or(
		goqu.Ex{
			"divisions.id": goqu.Op{"notIn": dialect.Select("festival_items.division_id").From("festival_items")},
		},
		goqu.Ex{
			"financial_records.id": goqu.Op{"notIn": dialect.Select("divisions.financial_record_id").From("divisions")},
		},
	))
