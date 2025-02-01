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

type FestivalItem = generated.FestivalItem
type FestivalItemRepository interface {
	AllByPeriodAndDivision(context.Context, string, string) (*sql.Rows, error)
	GetById(context.Context, string) (*sql.Row, error)
	CreateFestivalItem(context.Context, *sql.Tx, FestivalItem) error
	CreateItemBudget(context.Context, *sql.Tx, FestivalItem) error
	UpdateFestivalItem(context.Context, *sql.Tx, string, FestivalItem) error
	UpdateItemBudget(context.Context, *sql.Tx, string, FestivalItem) error
	DeleteFestivalItem(context.Context, *sql.Tx, string) error
	DeleteItemBudget(context.Context, *sql.Tx, string) error
	FindLatestRecord(context.Context) (*sql.Row, error)
	GetDetailByDivisionId(context.Context, string, string) (*sql.Rows, error)
}

func NewFestivalItemRepository(c db.Client, ac abstract.Crud) FestivalItemRepository {
	return &festivalItemRepository{c, ac}
}

// 年度別と部門で取得
func (fir *festivalItemRepository) AllByPeriodAndDivision(
	c context.Context,
	year string,
	divisionId string,
) (*sql.Rows, error) {
	ds := selectFestivalItemQuery
	if divisionId != "" {
		ds = ds.Where(goqu.Ex{"divisions.id": divisionId})
	}

	if year != "" {
		ds = ds.Where(goqu.Ex{"years.year": year})
	}

	query, _, err := ds.ToSQL()

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
	query, _, err := selectFestivalItemQuery.Where(goqu.Ex{"festival_items.id": id}).ToSQL()

	if err != nil {
		return nil, err
	}
	return fir.crud.ReadByID(c, query)
}

// 購入物品作成
func (fir *festivalItemRepository) CreateFestivalItem(
	c context.Context,
	tx *sql.Tx,
	festivalItem FestivalItem,
) error {
	ds := dialect.Insert("festival_items").
		Rows(goqu.Record{"name": festivalItem.Name, "memo": festivalItem.Memo, "division_id": festivalItem.DivisionId})
	query, _, err := ds.ToSQL()
	if err != nil {
		return err
	}
	err = fir.crud.TransactionExec(c, tx, query)
	return err
}

func (fir *festivalItemRepository) CreateItemBudget(
	c context.Context,
	tx *sql.Tx,
	festivalItem FestivalItem,
) error {
	ds := dialect.Insert("item_budgets").
		Rows(goqu.Record{"amount": festivalItem.Amount, "festival_item_id": goqu.L("LAST_INSERT_ID()")})
	query, _, err := ds.ToSQL()
	if err != nil {
		return err
	}
	err = fir.crud.TransactionExec(c, tx, query)
	return err
}

// festivalItem編集
func (fir *festivalItemRepository) UpdateFestivalItem(
	c context.Context,
	tx *sql.Tx,
	id string,
	festivalItem FestivalItem,
) error {
	ds := dialect.Update("festival_items").
		Set(goqu.Record{"name": festivalItem.Name, "memo": festivalItem.Memo, "division_id": festivalItem.DivisionId}).
		Where(goqu.Ex{"id": id})
	query, _, err := ds.ToSQL()
	if err != nil {
		return err
	}
	err = fir.crud.TransactionExec(c, tx, query)
	return err
}

// itemBudget編集
func (fir *festivalItemRepository) UpdateItemBudget(
	c context.Context,
	tx *sql.Tx,
	id string,
	festivalItem FestivalItem,
) error {
	ds := dialect.Update("item_budgets").
		Set(goqu.Record{"amount": festivalItem.Amount}).
		Where(goqu.Ex{"festival_item_id": id})
	query, _, err := ds.ToSQL()
	if err != nil {
		return err
	}
	err = fir.crud.TransactionExec(c, tx, query)
	return err
}

// 購入物品削除
func (fir *festivalItemRepository) DeleteFestivalItem(
	c context.Context,
	tx *sql.Tx,
	id string,
) error {
	ds := dialect.Delete("festival_items").Where(goqu.Ex{"id": id})
	query, _, err := ds.ToSQL()
	if err != nil {
		return err
	}
	err = fir.crud.TransactionExec(c, tx, query)
	return err
}

// 予算削除
func (fir *festivalItemRepository) DeleteItemBudget(
	c context.Context,
	tx *sql.Tx,
	id string,
) error {
	ds := dialect.Delete("item_budgets").Where(goqu.Ex{"festival_item_id": id})
	query, _, err := ds.ToSQL()
	if err != nil {
		return err
	}
	err = fir.crud.TransactionExec(c, tx, query)
	return err
}

// 最新のfestivalItemを取得する
func (fir *festivalItemRepository) FindLatestRecord(c context.Context) (*sql.Row, error) {
	query, _, err := selectFestivalItemQuery.Limit(1).ToSQL()

	if err != nil {
		return nil, err
	}
	return fir.crud.ReadByID(c, query)
}

// 年度別と部門で取得
func (fir *festivalItemRepository) GetDetailByDivisionId(
	c context.Context,
	year string,
	userId string,
) (*sql.Rows, error) {
	ds := selectFestivalItemForMypageQuery
	if userId != "" {
		ds = ds.Where(goqu.Ex{"users.id": userId})
	}

	if year != "" {
		ds = ds.Where(goqu.Ex{"years.year": year})
	}

	query, _, err := ds.ToSQL()

	if err != nil {
		return nil, err
	}

	return fir.crud.Read(c, query)
}

var selectFestivalItemQuery = dialect.Select(
	"festival_items.id",
	"festival_items.name",
	"festival_items.memo",
	"financial_records.name",
	"divisions.name",
	goqu.L("COALESCE(`item_budgets`.`amount`, 0)").As("budget"),
	goqu.COALESCE(goqu.SUM("buy_reports.amount"), 0).As("expense"),
	goqu.L("COALESCE(SUM(item_budgets.amount), 0) - COALESCE(SUM(buy_reports.amount), 0)").As("balance")).
	From("festival_items").
	InnerJoin(goqu.I("divisions"), goqu.On(goqu.I("festival_items.division_id").Eq(goqu.I("divisions.id")))).
	InnerJoin(goqu.I("financial_records"), goqu.On(goqu.I("divisions.financial_record_id").Eq(goqu.I("financial_records.id")))).
	InnerJoin(goqu.I("years"), goqu.On(goqu.I("financial_records.year_id").Eq(goqu.I("years.id")))).
	LeftJoin(goqu.I("item_budgets"), goqu.On(goqu.I("festival_items.id").Eq(goqu.I("item_budgets.festival_item_id")))).
	LeftJoin(goqu.I("buy_reports"), goqu.On(goqu.I("festival_items.id").Eq(goqu.I("buy_reports.festival_item_id")))).
	GroupBy("festival_items.id", "item_budgets.amount").
	Order(goqu.I("festival_items.id").Desc())

var selectFestivalItemForMypageQuery = dialect.Select(
	goqu.I("users.name").As("userName"),
	goqu.I("financial_records.name").As("financialRecordName"),
	goqu.I("divisions.id").As("divisionId"),
	goqu.I("divisions.name").As("divisionName"),
	goqu.I("festival_items.id").As("festivalItemId"),
	goqu.I("festival_items.name").As("festivalItemName"),
	goqu.I("years.year"),
	goqu.COALESCE(goqu.I("item_budgets.amount"), 0).As("budgetAmount"),
	goqu.COALESCE(goqu.I("buy_reports.id"), 0).As("buyReportId"),
	goqu.COALESCE(goqu.I("buy_reports.paid_by"), "").As("paidBy"),
	goqu.COALESCE(goqu.I("buy_reports.amount"), 0).As("reportAmount"),
	goqu.COALESCE(goqu.I("buy_reports.created_at"), "2025-01-29 20:53:44").As("reportDate"),
	goqu.COALESCE(goqu.I("buy_statuses.is_packed"), 0).As("isPacked"),
	goqu.COALESCE(goqu.I("buy_statuses.is_settled"), 0).As("isSettled")).
	From("festival_items").
	InnerJoin(goqu.I("divisions"), goqu.On(goqu.I("festival_items.division_id").Eq(goqu.I("divisions.id")))).
	InnerJoin(goqu.I("financial_records"), goqu.On(goqu.I("divisions.financial_record_id").Eq(goqu.I("financial_records.id")))).
	InnerJoin(goqu.I("user_groups"), goqu.On(goqu.I("divisions.id").Eq(goqu.I("user_groups.group_id")))).
	InnerJoin(goqu.I("users"), goqu.On(goqu.I("users.id").Eq(goqu.I("user_groups.user_id")))).
	InnerJoin(goqu.I("years"), goqu.On(goqu.I("financial_records.year_id").Eq(goqu.I("years.id")))).
	LeftJoin(goqu.I("item_budgets"), goqu.On(goqu.I("festival_items.id").Eq(goqu.I("item_budgets.festival_item_id")))).
	LeftJoin(goqu.I("buy_reports"), goqu.On(goqu.I("festival_items.id").Eq(goqu.I("buy_reports.festival_item_id")))).
	LeftJoin(goqu.I("buy_statuses"), goqu.On(goqu.I("buy_reports.id").Eq(goqu.I("buy_statuses.buy_report_id")))).
	Order(goqu.I("festival_items.id").Desc())
