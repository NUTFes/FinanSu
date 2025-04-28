package repository

import (
	"context"
	"database/sql"
	"fmt"

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
	conditions := make([]string, 0)
	return frr.crud.Read(c, makeSelectFinancialRecordDetailsSQL(conditions))
}

// 年度別に取得
func (frr *financialRecordRepository) AllByPeriod(
	c context.Context,
	year string,
) (*sql.Rows, error) {
	conditions := []string{"years.year = ?"}
	query := makeSelectFinancialRecordDetailsSQL(conditions)
	stmt, err := frr.crud.Prepare(c, query)
	if err != nil {
		return nil, err
	}
	defer func() {
		if err := stmt.Close(); err != nil {
			fmt.Println(err)
		}
	}()
	return stmt.QueryContext(c, year)
}

// IDで取得
func (frr *financialRecordRepository) GetById(
	c context.Context,
	id string,
) (*sql.Row, error) {
	conditions := []string{"financial_records.id = ?"}
	query := makeSelectFinancialRecordDetailsSQL(conditions)
	stmt, err := frr.crud.Prepare(c, query)
	if err != nil {
		return nil, err
	}
	defer func() {
		if err := stmt.Close(); err != nil {
			fmt.Println(err)
		}
	}()
	return stmt.QueryRowContext(c, id), nil
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

func (frr *financialRecordRepository) FindLatestRecord(c context.Context) (*sql.Row, error) {
	conditions := []string{"financial_records.id = LAST_INSERT_ID()"}
	query := makeSelectFinancialRecordDetailsSQL(conditions)
	stmt, err := frr.crud.Prepare(c, query)
	if err != nil {
		return nil, err
	}
	defer func() {
		if err := stmt.Close(); err != nil {
			fmt.Println(err)
		}
	}()
	return stmt.QueryRowContext(c), nil
}

// 年度別に取得
func (frr *financialRecordRepository) AllForCSV(
	c context.Context,
	year string,
) (*sql.Rows, error) {
	query := makeSelectFinancialRecordQueryForCsvExceptItemSQL()
	stmt, err := frr.crud.Prepare(c, query)
	if err != nil {
		return nil, err
	}
	defer func() {
		if err := stmt.Close(); err != nil {
			fmt.Println(err)
		}
	}()
	return stmt.QueryContext(c, year, year)
}

var selectFestivalItemGroupSQL = `
	SELECT
		festival_items.id,
		festival_items.division_id,
		festival_items.name,
		item_budgets.amount,
		COALESCE(SUM(buy_reports.amount), 0) AS expense
	FROM
		festival_items
	INNER JOIN
		item_budgets
	ON
		(festival_items.id = item_budgets.festival_item_id)
	LEFT JOIN
		buy_reports
	ON
		(festival_items.id = buy_reports.festival_item_id)
	GROUP BY
		item_budgets.id
`

func makeSelectFinancialRecordDetailsSQL(conditions []string) string {
	condition := ""
	if len(conditions) > 0 {
		for _, c := range conditions {
			condition += fmt.Sprintf(" AND %s", c)
		}
	}
	return fmt.Sprintf(`
	WITH
		festival_items_group
	AS ( %s )
	SELECT
		financial_records.id,
		financial_records.name,
		years.year,
		COALESCE(SUM(festival_items_group.amount), 0) AS budget,
		COALESCE(SUM(festival_items_group.expense), 0) AS expense,
		COALESCE(SUM(festival_items_group.amount), 0) - COALESCE(SUM(festival_items_group.expense), 0) AS balance
	FROM
		financial_records
	INNER JOIN
		years
	ON
		(financial_records.year_id = years.id)
	LEFT JOIN
		divisions
	ON
		(financial_records.id = divisions.financial_record_id)
	LEFT JOIN
		festival_items_group
	ON
		(festival_items_group.division_id = divisions.id)
	WHERE
		1=1
		%s
	GROUP BY
		financial_records.id
	ORDER BY
		financial_records.id`, selectFestivalItemGroupSQL, condition)
}

// CSV用の予算・部門を取得するクエリ
var selectFinancialRecordQueryForCsvSQL = `
	SELECT
		financial_records.id,
		financial_records.name,
		divisions.name,
		festival_items_group.name,
		festival_items_group.amount AS budget,
		festival_items_group.expense AS expense
	FROM
		festival_items_group
	INNER JOIN
		divisions
	ON
		festival_items_group.division_id = divisions.id
	INNER JOIN
		financial_records
	ON
		divisions.financial_record_id = financial_records.id
	INNER JOIN
		years
	ON
		financial_records.year_id = years.id
	WHERE years.year = ?
`

// 予算・部門がないものを取得するクエリ
var selectFinancialRecordQueryForCsvExceptItemSQL = `
	SELECT
		financial_records.id,
		financial_records.name,
		COALESCE(divisions.name, '') AS divisionName,
		'' AS festivalItemName,
		0 AS budget,
		0 AS expense
	FROM
		financial_records
	LEFT JOIN
		divisions
	ON
		divisions.financial_record_id = financial_records.id
	INNER JOIN
		years
	ON
		financial_records.year_id = years.id
	WHERE
		(divisions.id NOT IN (SELECT festival_items.division_id FROM festival_items)
			OR
		financial_records.id NOT IN (SELECT divisions.financial_record_id FROM divisions))
	AND years.year = ?
`

// csv用の予算・部門を取得するクエリ
func makeSelectFinancialRecordQueryForCsvExceptItemSQL() string {
	return fmt.Sprintf(`
		WITH festival_items_group AS ( %s )
			%s
		UNION
			( %s )
		ORDER BY id ASC
		`, selectFestivalItemGroupSQL, selectFinancialRecordQueryForCsvSQL, selectFinancialRecordQueryForCsvExceptItemSQL)
}
