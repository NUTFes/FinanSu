package repository

import (
	"context"
	"database/sql"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
	"github.com/NUTFes/FinanSu/api/generated"
	goqu "github.com/doug-martin/goqu/v9"
)

type festivalItemRepository struct {
	client db.Client
	crud   abstract.Crud
}

type FestivalItemRepository interface {
	All(context.Context) (*sql.Rows, error)
	AllByPeriod(context.Context, string) (*sql.Rows, error)
	GetById(context.Context, string) (*sql.Row, error)
	Create(context.Context, generated.FestivalItem) error
	Update(context.Context, string, generated.FestivalItem) error
	Delete(context.Context, string) error
	FindLatestRecord(context.Context) (*sql.Row, error)
}

func NewFestivalItemRepository(c db.Client, ac abstract.Crud) FestivalItemRepository {
	return &festivalItemRepository{c, ac}
}

// 年度別に取得
func (fir *festivalItemRepository) All(
	c context.Context,
) (*sql.Rows, error) {
	query, _, err := dialect.Select(
		"financial_records.id",
		"financial_records.name", "years.year",
		goqu.COALESCE(goqu.SUM("item_budgets.amount"), 0).As("budget"),
		goqu.COALESCE(goqu.SUM("buy_reports.amount"), 0).As("expense"),
		goqu.COALESCE(goqu.L("SUM(item_budgets.amount) - SUM(buy_reports.amount)"), 0).As("balance")).
		From("financial_records").
		InnerJoin(goqu.I("years"), goqu.On(goqu.I("financial_records.year_id").Eq(goqu.I("years.id")))).
		LeftJoin(goqu.I("divisions"), goqu.On(goqu.I("financial_records.id").Eq(goqu.I("divisions.financial_record_id")))).
		LeftJoin(goqu.I("festival_items"), goqu.On(goqu.I("divisions.id").Eq(goqu.I("festival_items.division_id")))).
		LeftJoin(goqu.I("item_budgets"), goqu.On(goqu.I("festival_items.id").Eq(goqu.I("item_budgets.festival_item_id")))).
		LeftJoin(goqu.I("buy_reports"), goqu.On(goqu.I("festival_items.id").Eq(goqu.I("buy_reports.festival_item_id")))).
		GroupBy("financial_records.id").
		ToSQL()

	if err != nil {
		return nil, err
	}
	return fir.crud.Read(c, query)
}

// 年度別に取得
func (fir *festivalItemRepository) AllByPeriod(
	c context.Context,
	year string,
) (*sql.Rows, error) {
	query, _, err := dialect.Select(
		"financial_records.id",
		"financial_records.name", "years.year",
		goqu.COALESCE(goqu.SUM("item_budgets.amount"), 0).As("budget"),
		goqu.COALESCE(goqu.SUM("buy_reports.amount"), 0).As("expense"),
		goqu.COALESCE(goqu.L("SUM(item_budgets.amount) - SUM(buy_reports.amount)"), 0).As("balance")).
		From("financial_records").
		InnerJoin(goqu.I("years"), goqu.On(goqu.I("financial_records.year_id").Eq(goqu.I("years.id")))).
		LeftJoin(goqu.I("divisions"), goqu.On(goqu.I("financial_records.id").Eq(goqu.I("divisions.financial_record_id")))).
		LeftJoin(goqu.I("festival_items"), goqu.On(goqu.I("divisions.id").Eq(goqu.I("festival_items.division_id")))).
		LeftJoin(goqu.I("item_budgets"), goqu.On(goqu.I("festival_items.id").Eq(goqu.I("item_budgets.festival_item_id")))).
		LeftJoin(goqu.I("buy_reports"), goqu.On(goqu.I("festival_items.id").Eq(goqu.I("buy_reports.festival_item_id")))).
		GroupBy("financial_records.id").
		Where(goqu.Ex{"years.year": year}).
		ToSQL()
	if err != nil {
		return nil, err
	}
	return fir.crud.Read(c, query)
}

// IDで取得
func (fir *festivalItemRepository) GetById(
	c context.Context,
	id string,
) (*sql.Row, error) {
	query, _, err := dialect.Select(
		"financial_records.id",
		"financial_records.name", "years.year",
		goqu.COALESCE(goqu.SUM("item_budgets.amount"), 0).As("budget"),
		goqu.COALESCE(goqu.SUM("buy_reports.amount"), 0).As("expense"),
		goqu.COALESCE(goqu.L("SUM(item_budgets.amount) - SUM(buy_reports.amount)"), 0).As("balance")).
		From("financial_records").
		InnerJoin(goqu.I("years"), goqu.On(goqu.I("financial_records.year_id").Eq(goqu.I("years.id")))).
		LeftJoin(goqu.I("divisions"), goqu.On(goqu.I("financial_records.id").Eq(goqu.I("divisions.financial_record_id")))).
		LeftJoin(goqu.I("festival_items"), goqu.On(goqu.I("divisions.id").Eq(goqu.I("festival_items.division_id")))).
		LeftJoin(goqu.I("item_budgets"), goqu.On(goqu.I("festival_items.id").Eq(goqu.I("item_budgets.festival_item_id")))).
		LeftJoin(goqu.I("buy_reports"), goqu.On(goqu.I("festival_items.id").Eq(goqu.I("buy_reports.festival_item_id")))).
		GroupBy("financial_records.id").
		Where(goqu.Ex{"financial_records.id": id}).
		ToSQL()
	if err != nil {
		return nil, err
	}
	return fir.crud.ReadByID(c, query)
}

// 作成
func (fir *festivalItemRepository) Create(
	c context.Context,
	festivalItem generated.FestivalItem,
) error {
	ds := dialect.Insert("financial_records").
		Rows(goqu.Record{"name": festivalItem.Name, "year_id": festivalItem.Memo})
	query, _, err := ds.ToSQL()
	if err != nil {
		return err
	}
	return fir.crud.UpdateDB(c, query)
}

// 編集
func (fir *festivalItemRepository) Update(
	c context.Context,
	id string,
	festivalItem generated.FestivalItem,
) error {
	ds := dialect.Update("financial_records").
		Set(goqu.Record{"name": festivalItem.Name, "year_id": festivalItem.Memo}).
		Where(goqu.Ex{"id": id})
	query, _, err := ds.ToSQL()
	if err != nil {
		return err
	}
	return fir.crud.UpdateDB(c, query)
}

// 削除
func (fir *festivalItemRepository) Delete(
	c context.Context,
	id string,
) error {
	ds := dialect.Delete("financial_records").Where(goqu.Ex{"id": id})
	query, _, err := ds.ToSQL()
	if err != nil {
		return err
	}
	return fir.crud.UpdateDB(c, query)

}

// 最新のfestivalItemを取得する
func (fir *festivalItemRepository) FindLatestRecord(c context.Context) (*sql.Row, error) {
	query, _, err := dialect.Select(
		"financial_records.id",
		"financial_records.name", "years.year",
		goqu.COALESCE(goqu.SUM("item_budgets.amount"), 0).As("budget"),
		goqu.COALESCE(goqu.SUM("buy_reports.amount"), 0).As("expense"),
		goqu.COALESCE(goqu.L("SUM(item_budgets.amount) - SUM(buy_reports.amount)"), 0).As("balance")).
		From("financial_records").
		InnerJoin(goqu.I("years"), goqu.On(goqu.I("financial_records.year_id").Eq(goqu.I("years.id")))).
		LeftJoin(goqu.I("divisions"), goqu.On(goqu.I("financial_records.id").Eq(goqu.I("divisions.financial_record_id")))).
		LeftJoin(goqu.I("festival_items"), goqu.On(goqu.I("divisions.id").Eq(goqu.I("festival_items.division_id")))).
		LeftJoin(goqu.I("item_budgets"), goqu.On(goqu.I("festival_items.id").Eq(goqu.I("item_budgets.festival_item_id")))).
		LeftJoin(goqu.I("buy_reports"), goqu.On(goqu.I("festival_items.id").Eq(goqu.I("buy_reports.festival_item_id")))).
		GroupBy("financial_records.id").
		Order(goqu.I("id").Desc()).
		Limit(1).
		ToSQL()
	if err != nil {
		return nil, err
	}
	return fir.crud.ReadByID(c, query)
}
