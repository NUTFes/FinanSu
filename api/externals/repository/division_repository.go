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

type divisionRepository struct {
	client db.Client
	crud   abstract.Crud
}

type DivisionRepository interface {
	AllByPeriodAndFinancialRecord(context.Context, string, string) (*sql.Rows, error)
	GetById(context.Context, string) (*sql.Row, error)
	GetDivisionOptionsByUserId(context.Context, string, string) (*sql.Rows, error)
	GetDivisionById(context.Context, string) (*sql.Row, error)
	Create(context.Context, Division) error
	Update(context.Context, string, Division) error
	Delete(context.Context, string) error
	FindLatestRecord(context.Context) (*sql.Row, error)
	GetDivisionsYears(context.Context, string) (*sql.Rows, error)
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

	var conditions []string
	var args []interface{}

	if year != "" {
		conditions = append(conditions, "years.year = ?")
		args = append(args, year)
	}
	if financialRecordId != "" {
		conditions = append(conditions, "financial_records.id = ?")
		args = append(args, financialRecordId)
	}

	query := makeSelectDivisionsSQL(conditions)
	stmt, err := dr.crud.Prepare(c, query)
	if err != nil {
		return nil, err
	}
	defer func() {
		if stmt != nil {
			if cerr := stmt.Close(); cerr != nil {
				fmt.Println("stmt.Close() error:", cerr)
			}
		}
	}()

	return stmt.QueryContext(c, args...)
}

// IDで取得
func (dr *divisionRepository) GetById(
	c context.Context,
	id string,
) (*sql.Row, error) {
	conditions := []string{"divisions.id = ?"}
	query := makeSelectDivisionsSQL(conditions)

	stmt, err := dr.crud.Prepare(c, query)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	return stmt.QueryRowContext(c, id), nil
}

// IDでdivisionのみ取得
func (dr *divisionRepository) GetDivisionById(
	c context.Context,
	id string,
) (*sql.Row, error) {
	ds, _, err := dialect.From("divisions").
		Select("id", "name", "financial_record_id").
		Where(goqu.Ex{"id": id}).
		ToSQL()

	if err != nil {
		return nil, err
	}
	return dr.crud.ReadByID(c, ds)
}

// ユーザーIDで部門オプションを取得
func (dr *divisionRepository) GetDivisionOptionsByUserId(
	c context.Context,
	year string,
	userId string,
) (*sql.Rows, error) {
	ds := selectDivisionOptionsQuery

	if userId != "" {
		ds = ds.Where(goqu.Ex{"users.id": userId})
	}
	if year != "" {
		ds = ds.Where(goqu.Ex{"years.year": year})
	}

	query, args, err := ds.ToSQL()
	if err != nil {
		return nil, err
	}

	stmt, err := dr.crud.Prepare(c, query)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	return stmt.QueryContext(c, args...)
}

// 部門作成
func (dr *divisionRepository) Create(
	c context.Context,
	division Division,
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
	division Division,
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
	conditions := []string{"divisions.id = LAST_INSERT_ID()"}
	query := makeSelectDivisionsSQL(conditions)

	return dr.client.DB().QueryRowContext(c, query), nil
}

// 年度一覧取得
func (dr *divisionRepository) GetDivisionsYears(c context.Context, year string) (*sql.Rows, error) {
	ds := dialect.From(goqu.I("divisions")).
		Select(
			goqu.I("divisions.id").As("divisionId"),
			goqu.I("divisions.name").As("name"),
		).
		Join(
			goqu.I("financial_records"),
			goqu.On(goqu.I("financial_records.id").Eq(goqu.I("divisions.financial_record_id"))),
		).
		Join(
			goqu.I("years"),
			goqu.On(goqu.I("financial_records.year_id").Eq(goqu.I("years.id"))),
		)
	if year != "" {
		ds = ds.Where(goqu.Ex{"years.year": year})
	}
	query, args, err := ds.ToSQL()
	if err != nil {
		return nil, err
	}
	stmt, err := dr.crud.Prepare(c, query)
	if err != nil {
		return nil, err
	}
	return stmt.QueryContext(c, args...)
}

type Division = generated.Division

// NOTE: getの共通部分抜き出し
func makeSelectDivisionsSQL(conditions []string) string {
	condition := ""
	if len(conditions) > 0 {
		for _, c := range conditions {
			condition += fmt.Sprintf(" AND %s", c)
		}
	}

	return fmt.Sprintf(`
		WITH item_budget_sum AS (
			SELECT
				divisions.id AS division_id,
				SUM(item_budgets.amount) AS total_budget
			FROM divisions
			LEFT JOIN festival_items ON divisions.id = festival_items.division_id
			LEFT JOIN item_budgets ON festival_items.id = item_budgets.festival_item_id
			GROUP BY divisions.id
		),
		buy_report_sum AS (
			SELECT
				divisions.id AS division_id,
				SUM(buy_reports.amount) AS total_expense
			FROM divisions
			LEFT JOIN festival_items ON divisions.id = festival_items.division_id
			LEFT JOIN buy_reports ON festival_items.id = buy_reports.festival_item_id
			GROUP BY divisions.id
		)
		SELECT
			divisions.id,
			divisions.name,
			financial_records.name,
			COALESCE(item_budget_sum.total_budget, 0) AS budget,
			COALESCE(buy_report_sum.total_expense, 0) AS expense,
			COALESCE(item_budget_sum.total_budget, 0) - COALESCE(buy_report_sum.total_expense, 0) AS balance
		FROM divisions
		INNER JOIN financial_records ON financial_records.id = divisions.financial_record_id
		INNER JOIN years ON financial_records.year_id = years.id
		LEFT JOIN item_budget_sum ON item_budget_sum.division_id = divisions.id
		LEFT JOIN buy_report_sum ON buy_report_sum.division_id = divisions.id
		WHERE 1=1
		%s
		ORDER BY divisions.id DESC
	`, condition)
}

var selectDivisionOptionsQuery = dialect.From("divisions").
	Select(
		goqu.I("divisions.id").As("divisionId"),
		goqu.I("divisions.name").As("name"),
	).
	Join(
		goqu.I("financial_records"),
		goqu.On(goqu.I("financial_records.id").Eq(goqu.I("divisions.financial_record_id"))),
	).
	Join(
		goqu.I("years"),
		goqu.On(goqu.I("financial_records.year_id").Eq(goqu.I("years.id"))),
	).
	Join(
		goqu.I("user_groups"),
		goqu.On(goqu.I("divisions.id").Eq(goqu.I("user_groups.group_id"))),
	).
	Join(
		goqu.I("users"),
		goqu.On(goqu.I("users.id").Eq(goqu.I("user_groups.user_id"))),
	).
	Order(goqu.I("divisions.id").Asc())
