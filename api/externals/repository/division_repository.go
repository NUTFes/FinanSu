package repository

import (
	"context"
	"database/sql"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
	"github.com/NUTFes/FinanSu/api/generated"
	goqu "github.com/doug-martin/goqu/v9"
)

type divisionRepository struct {
	client db.Client
	crud   abstract.Crud
}

type DivisionRepository interface {
	AllByPeriodAndFinancialRecord(context.Context, string, string) (*sql.Rows, error)
	GetById(context.Context, string) (*sql.Row, error)
	Create(context.Context, division) error
	Update(context.Context, string, division) error
	Delete(context.Context, string) error
	FindLatestRecord(context.Context) (*sql.Row, error)
}

func NewDivisionRepository(c db.Client, ac abstract.Crud) DivisionRepository {
	return &divisionRepository{c, ac}
}

// 年度別と財務記録で取得
func (dr *divisionRepository) AllByPeriodAndFinancialRecord(
	c context.Context,
	year string,
	financialRecordId string,
) (*sql.Rows, error) {

	ds := selectDivisionQuery

	if year != "" {
		ds = ds.Where(goqu.C("years.year").Eq(year))
	}

	if financialRecordId != "" {
		ds = ds.Where(goqu.C("financial_records.id").Eq(financialRecordId))
	}

	// クエリを構築し、SQLを生成
	query, _, err := ds.GroupBy("divisions.id").ToSQL()
	if err != nil {
		return nil, err
	}
	return dr.crud.Read(c, query)
}

// IDで取得
func (dr *divisionRepository) GetById(
	c context.Context,
	id string,
) (*sql.Row, error) {
	ds, _, err := selectDivisionQuery.
		Where(goqu.Ex{"divisions.id": id}).
		ToSQL()
	if err != nil {
		return nil, err
	}
	return dr.crud.ReadByID(c, ds)
}

// 部門作成
func (dr *divisionRepository) Create(
	c context.Context,
	division division,
) error {
	ds := dialect.Insert("divisions").
		Rows(goqu.Record{"name": division.Name, "financial_record_id": division.FinancialRecordID})
	query, _, err := ds.ToSQL()
	if err != nil {
		return err
	}
	return dr.crud.UpdateDB(c, query)
}

// 部門更新
func (dr *divisionRepository) Update(
	c context.Context,
	id string,
	division division,
) error {
	ds := dialect.Update("divisions").
		Set(goqu.Record{"name": division.Name, "financial_record_id": division.FinancialRecordID}).
		Where(goqu.Ex{"id": id})
	query, _, err := ds.ToSQL()
	if err != nil {
		return err
	}
	return dr.crud.UpdateDB(c, query)
}

// 部門削除
func (dr *divisionRepository) Delete(
	c context.Context,
	id string,
) error {
	ds := dialect.Delete("divisions").Where(goqu.Ex{"id": id})
	query, _, err := ds.ToSQL()
	if err != nil {
		return err
	}
	return dr.crud.UpdateDB(c, query)
}

// 最新の部門を取得する
func (dr *divisionRepository) FindLatestRecord(c context.Context) (*sql.Row, error) {
	ds := selectDivisionQuery
	query, _, err := ds.Limit(1).ToSQL()

	if err != nil {
		return nil, err
	}
	return dr.crud.ReadByID(c, query)
}

// Note: この中のみで呼ぶために小文字宣言
type division = generated.Division

// NOTE: getの共通部分抜き出し
var selectDivisionQuery = dialect.From("divisions").
	Select(
		"divisions.id",
		"divisions.name",
		"financial_records.name",
		goqu.COALESCE(goqu.SUM("item_budgets.amount"), 0).As("budget"),
		goqu.COALESCE(goqu.SUM("buy_reports.amount"), 0).As("expense"),
		goqu.L("COALESCE(SUM(item_budgets.amount), 0) - COALESCE(SUM(buy_reports.amount), 0)").As("balance")).
	InnerJoin(goqu.I("financial_records"), goqu.On(goqu.I("financial_records.id").Eq(goqu.I("divisions.financial_record_id")))).
	InnerJoin(goqu.I("years"), goqu.On(goqu.I("financial_records.year_id").Eq(goqu.I("years.id")))).
	LeftJoin(goqu.I("festival_items"), goqu.On(goqu.I("divisions.id").Eq(goqu.I("festival_items.division_id")))).
	LeftJoin(goqu.I("item_budgets"), goqu.On(goqu.I("festival_items.id").Eq(goqu.I("item_budgets.festival_item_id")))).
	LeftJoin(goqu.I("buy_reports"), goqu.On(goqu.I("festival_items.id").Eq(goqu.I("buy_reports.festival_item_id")))).
	GroupBy(goqu.I("divisions.id")).
	Order(goqu.I("divisions.id").Desc())
