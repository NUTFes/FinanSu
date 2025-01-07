package repository

import (
	"context"
	"database/sql"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
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
	Create(context.Context, string, string, string, string, string) error
	Update(context.Context, string, string, string, string, string, string) error
	Delete(context.Context, string) error
	FindLatestRecord(context.Context) (*sql.Row, error)
}

func NewFinancialRecordRepository(c db.Client, ac abstract.Crud) FinancialRecordRepository {
	return &financialRecordRepository{c, ac}
}

// 年度別に取得
func (frr *financialRecordRepository) All(
	c context.Context,
) (*sql.Rows, error) {
	query, _, err := dialect.Select("sponsors.*").From("sponsors").ToSQL()
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
	query, _, err := dialect.Select("sponsors.*").
		From("sponsors").
		InnerJoin(goqu.I("year_periods"), goqu.On(goqu.I("sponsors.created_at").Gt(goqu.I("year_periods.started_at")), goqu.I("sponsors.created_at").Lt(goqu.I("year_periods.ended_at")))).
		InnerJoin(goqu.I("years"), goqu.On(goqu.I("year_periods.year_id").Eq(goqu.I("years.id")))).
		Where(goqu.Ex{"years.year": year}).
		Order(goqu.I("sponsors.id").Desc()).
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
	query, _, err := dialect.Select("sponsors.*").
		From("sponsors").
		Where(goqu.Ex{"sponsors.id": id}).
		ToSQL()
	if err != nil {
		return nil, err
	}
	return frr.crud.ReadByID(c, query)
}

// 作成
func (frr *financialRecordRepository) Create(
	c context.Context,
	name string,
	tel string,
	email string,
	address string,
	representative string,
) error {
	ds := dialect.Insert("sponsors").
		Rows(goqu.Record{"name": name, "tel": tel, "email": email, "address": address, "representative": representative})
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
	name string,
	tel string,
	email string,
	address string,
	representative string,
) error {
	ds := dialect.Update("sponsors").
		Set(goqu.Record{"name": name, "tel": tel, "email": email, "address": address, "representative": representative}).
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
	ds := dialect.Delete("sponsors").Where(goqu.Ex{"id": id})
	query, _, err := ds.ToSQL()
	if err != nil {
		return err
	}
	return frr.crud.UpdateDB(c, query)

}

// 最新のsponcerを取得する
func (frr *financialRecordRepository) FindLatestRecord(c context.Context) (*sql.Row, error) {
	query, _, err := dialect.From("sponsors").Order(goqu.I("id").Desc()).Limit(1).ToSQL()
	if err != nil {
		return nil, err
	}
	return frr.crud.ReadByID(c, query)
}
