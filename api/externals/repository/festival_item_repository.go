package repository

import (
	"context"
	"database/sql"
	"fmt"
	"strings"

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
	GetFestivalItemById(context.Context, string) (*sql.Row, error)
	CreateFestivalItem(context.Context, *sql.Tx, FestivalItem) error
	CreateItemBudget(context.Context, *sql.Tx, FestivalItem) error
	UpdateFestivalItem(context.Context, *sql.Tx, string, FestivalItem) error
	UpdateItemBudget(context.Context, *sql.Tx, string, FestivalItem) error
	DeleteFestivalItem(context.Context, *sql.Tx, string) error
	DeleteItemBudget(context.Context, *sql.Tx, string) error
	FindLatestRecord(context.Context) (*sql.Row, error)
	GetDetailsByDivisionId(context.Context, string, string) (*sql.Rows, error)
	GetFestivalItemOptions(context.Context, string, string) (*sql.Rows, error)
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
	var conditions []string
	var args []interface{}

	if divisionId != "" {
		conditions = append(conditions, "divisions.id = ?")
		args = append(args, divisionId)
	}
	if year != "" {
		conditions = append(conditions, "years.year = ?")
		args = append(args, year)
	}

	query := makeSelectFestivalItemSQL(conditions)

	stmt, err := fir.crud.Prepare(c, query)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	return stmt.QueryContext(c, args...)
}

// IDで取得
func (fir *festivalItemRepository) GetById(
	c context.Context,
	id string,
) (*sql.Row, error) {
	conditions := []string{"festival_items.id = ?"}
	query := makeSelectFestivalItemSQL(conditions)

	stmt, err := fir.crud.Prepare(c, query)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	return stmt.QueryRowContext(c, id), nil
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
	conditions := []string{"festival_items.id = LAST_INSERT_ID()"}
	query := makeSelectFestivalItemSQL(conditions)
	stmt, err := fir.crud.Prepare(c, query)
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

// 年度別と部門で取得
func (fir *festivalItemRepository) GetDetailsByDivisionId(
	c context.Context,
	year string,
	userId string,
) (*sql.Rows, error) {
	var conditions []string
	var args []interface{}

	if userId != "" {
		conditions = append(conditions, "users.id = ?")
		args = append(args, userId)
	}
	if year != "" {
		conditions = append(conditions, "years.year = ?")
		args = append(args, year)
	}

	query := makeSelectFestivalItemForMypageSQL(conditions)

	stmt, err := fir.crud.Prepare(c, query)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	return stmt.QueryContext(c, args...)
}

func (fir *festivalItemRepository) GetFestivalItemOptions(
	c context.Context,
	year string,
	divisionId string,
) (*sql.Rows, error) {
	var conditions []string
	var args []interface{}

	if divisionId != "" {
		conditions = append(conditions, "divisions.id = ?")
		args = append(args, divisionId)
	}
	if year != "" {
		conditions = append(conditions, "years.year = ?")
		args = append(args, year)
	}

	query := makeSelectFestivalItemOptionsSQL(conditions)

	stmt, err := fir.crud.Prepare(c, query)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	return stmt.QueryContext(c, args...)
}

// IDでFestivalItemを取得
func (fir *festivalItemRepository) GetFestivalItemById(
	c context.Context,
	festivalItemId string,
) (*sql.Row, error) {
	ds := dialect.Select(
		"festival_items.id",
		"festival_items.name",
		"festival_items.division_id",
		"festival_items.memo",
		"item_budgets.amount",
	).
		From("festival_items").
		LeftJoin(goqu.I("item_budgets"), goqu.On(goqu.I("festival_items.id").Eq(goqu.I("item_budgets.festival_item_id")))).
		Where(goqu.Ex{"festival_items.id": festivalItemId})

	query, _, err := ds.ToSQL()

	if err != nil {
		return nil, err
	}

	return fir.crud.ReadByID(c, query)
}

func makeSelectFestivalItemSQL(conditions []string) string {
	whereClause := ""
	if len(conditions) > 0 {
		whereClause = "WHERE " + strings.Join(conditions, " AND ")
	}

	return fmt.Sprintf(`
		WITH item_budget_sum AS (
			SELECT festival_item_id, SUM(amount) AS total_budget
			FROM item_budgets
			GROUP BY festival_item_id
		),
		buy_report_sum AS (
			SELECT festival_item_id, SUM(amount) AS total_expense
			FROM buy_reports
			GROUP BY festival_item_id
		)
		SELECT
			festival_items.id,
			festival_items.name,
			festival_items.memo,
			financial_records.name,
			divisions.name,
			COALESCE(item_budget_sum.total_budget, 0) AS budget,
			COALESCE(buy_report_sum.total_expense, 0) AS expense,
			COALESCE(item_budget_sum.total_budget, 0) - COALESCE(buy_report_sum.total_expense, 0) AS balance
		FROM festival_items
		INNER JOIN divisions ON festival_items.division_id = divisions.id
		INNER JOIN financial_records ON divisions.financial_record_id = financial_records.id
		INNER JOIN years ON financial_records.year_id = years.id
		LEFT JOIN item_budget_sum ON festival_items.id = item_budget_sum.festival_item_id
		LEFT JOIN buy_report_sum ON festival_items.id = buy_report_sum.festival_item_id
		%s
		ORDER BY festival_items.id DESC
	`, whereClause)
}

func makeSelectFestivalItemOptionsSQL(conditions []string) string {
	whereClause := ""
	if len(conditions) > 0 {
		whereClause = "WHERE " + strings.Join(conditions, " AND ")
	}
	return fmt.Sprintf(`
		SELECT
			festival_items.id AS festivalItemId,
			festival_items.name AS name
		FROM festival_items
		INNER JOIN divisions ON festival_items.division_id = divisions.id
		INNER JOIN financial_records ON divisions.financial_record_id = financial_records.id
		INNER JOIN years ON financial_records.year_id = years.id
		%s
		ORDER BY festival_items.id DESC
	`, whereClause)
}

func makeSelectFestivalItemForMypageSQL(conditions []string) string {
	whereClause := ""
	if len(conditions) > 0 {
		whereClause = "WHERE " + strings.Join(conditions, " AND ")
	}
	return fmt.Sprintf(`
		SELECT
			users.name AS userName,
			financial_records.name AS financialRecordName,
			divisions.id AS divisionId,
			divisions.name AS divisionName,
			festival_items.id AS festivalItemId,
			festival_items.name AS festivalItemName,
			years.year,
			COALESCE(item_budgets.amount, 0) AS budgetAmount,
			COALESCE(buy_reports.id, 0) AS buyReportId,
			COALESCE(buy_reports.paid_by, '') AS paidBy,
			COALESCE(buy_reports.amount, 0) AS reportAmount,
			COALESCE(buy_reports.created_at, '2000-01-01 00:00:00') AS reportDate,
			COALESCE(buy_statuses.is_packed, 0) AS isPacked,
			COALESCE(buy_statuses.is_settled, 0) AS isSettled
		FROM festival_items
		INNER JOIN divisions ON festival_items.division_id = divisions.id
		INNER JOIN financial_records ON divisions.financial_record_id = financial_records.id
		INNER JOIN user_groups ON divisions.id = user_groups.group_id
		INNER JOIN users ON users.id = user_groups.user_id
		INNER JOIN years ON financial_records.year_id = years.id
		LEFT JOIN item_budgets ON festival_items.id = item_budgets.festival_item_id
		LEFT JOIN buy_reports ON festival_items.id = buy_reports.festival_item_id
		LEFT JOIN buy_statuses ON buy_reports.id = buy_statuses.buy_report_id
		%s
		ORDER BY festival_items.id DESC
	`, whereClause)
}
