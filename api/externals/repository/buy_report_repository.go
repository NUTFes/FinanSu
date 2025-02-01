package repository

import (
	"context"
	"database/sql"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
)

type buyReportRepository struct {
	client db.Client
	crud   abstract.Crud
}

type BuyReportRepository interface {
	All(context.Context) (*sql.Rows, error)
}

func NewBuyReportRepository(c db.Client, ac abstract.Crud) BuyReportRepository {
	return &buyReportRepository{c, ac}
}

// 全件取得
func (brr *buyReportRepository) All(c context.Context) (*sql.Rows, error) {
	query, _, err := dialect.From("buy_reports").ToSQL()
	if err != nil {
		return nil, err
	}
	return brr.crud.Read(c, query)
}

// 1件取得
// func (sr *sponsorRepository) Find(c context.Context, id string) (*sql.Row, error) {
// 	query, _, err := dialect.From("sponsors").Where(goqu.Ex{"id": id}).ToSQL()
// 	if err != nil {
// 		return nil, err
// 	}
// 	return sr.crud.ReadByID(c, query)
// }

// // 作成
// func (sr *sponsorRepository) Create(
// 	c context.Context,
// 	name string,
// 	tel string,
// 	email string,
// 	address string,
// 	representative string,
// ) error {
// 	ds := dialect.Insert("sponsors").
// 		Rows(goqu.Record{"name": name, "tel": tel, "email": email, "address": address, "representative": representative})
// 	query, _, err := ds.ToSQL()
// 	if err != nil {
// 		return err
// 	}
// 	return sr.crud.UpdateDB(c, query)
// }

// // 編集
// func (sr *sponsorRepository) Update(
// 	c context.Context,
// 	id string,
// 	name string,
// 	tel string,
// 	email string,
// 	address string,
// 	representative string,
// ) error {
// 	ds := dialect.Update("sponsors").
// 		Set(goqu.Record{"name": name, "tel": tel, "email": email, "address": address, "representative": representative}).
// 		Where(goqu.Ex{"id": id})
// 	query, _, err := ds.ToSQL()
// 	if err != nil {
// 		return err
// 	}
// 	return sr.crud.UpdateDB(c, query)
// }

// // 削除
// func (sr *sponsorRepository) Delete(
// 	c context.Context,
// 	id string,
// ) error {
// 	ds := dialect.Delete("sponsors").Where(goqu.Ex{"id": id})
// 	query, _, err := ds.ToSQL()
// 	if err != nil {
// 		return err
// 	}
// 	return sr.crud.UpdateDB(c, query)

// }

// // 最新のsponcerを取得する
// func (sr *sponsorRepository) FindLatestRecord(c context.Context) (*sql.Row, error) {
// 	query, _, err := dialect.From("sponsors").Order(goqu.I("id").Desc()).Limit(1).ToSQL()
// 	if err != nil {
// 		return nil, err
// 	}
// 	return sr.crud.ReadByID(c, query)
// }

// // 年度別に取得
// func (sr *sponsorRepository) AllByPeriod(c context.Context, year string) (*sql.Rows, error) {
// 	query, _, err := dialect.Select("sponsors.*").
// 		From("sponsors").
// 		InnerJoin(goqu.I("year_periods"), goqu.On(goqu.I("sponsors.created_at").Gt(goqu.I("year_periods.started_at")), goqu.I("sponsors.created_at").Lt(goqu.I("year_periods.ended_at")))).
// 		InnerJoin(goqu.I("years"), goqu.On(goqu.I("year_periods.year_id").Eq(goqu.I("years.id")))).
// 		Where(goqu.Ex{"years.year": year}).
// 		Order(goqu.I("sponsors.id").Desc()).
// 		ToSQL()
// 	if err != nil {
// 		return nil, err
// 	}
// 	return sr.crud.Read(c, query)
// }
