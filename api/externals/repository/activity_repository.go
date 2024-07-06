package repository

import (
	"context"
	"database/sql"
	"strings"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
)

type activityRepository struct {
	client db.Client
	crud   abstract.Crud
}

type ActivityRepository interface {
	All(context.Context) (*sql.Rows, error)
	Find(context.Context, string) (*sql.Row, error)
	Create(context.Context, string, string, string, string, string, string, string, string) error
	Update(context.Context, string, string, string, string, string,string, string, string, string) error
	Destroy(context.Context, string) error
	FindDetail(context.Context) (*sql.Rows, error)
	FindLatestRecord(c context.Context) (*sql.Row, error)
	FindSponsorStyle(context.Context, string) (*sql.Rows, error)
	AllDetailsByPeriod(context.Context, string) (*sql.Rows, error)
	FindActivityInformation(context.Context, string) (*sql.Rows, error)
	FindFilteredDetail(context.Context, string, []string, string) (*sql.Rows, error)
	FindFilteredDetailByPeriod(context.Context, string, []string, string, string) (*sql.Rows, error)
}

func NewActivityRepository(c db.Client, ac abstract.Crud) ActivityRepository {
	return &activityRepository{c, ac}
}

// 全件取得
func (ar *activityRepository) All(c context.Context) (*sql.Rows, error) {
	query := "SELECT * FROM activities"
	return ar.crud.Read(c, query)
}

// 1件取得
func (ar *activityRepository) Find(c context.Context, id string) (*sql.Row, error) {
	query := "SELECT * FROM activities WHERE id =" + id
	return ar.crud.ReadByID(c, query)
}

// 作成
func (ar *activityRepository) Create(
	c context.Context,
	userID string,
	isDone string,
	sponsorID string,
	feature string,
	expense string,
	remark string,
	design string,
	url string,
	) error {

	query := `
	INSERT INTO	activities
		(user_id, is_done, sponsor_id, feature, expense, remark, design, url)
	VALUES
		(` +userID + `,` + isDone + `,` + sponsorID +`,"` + feature + `",` + expense +`,"` + remark +`",` +design +`,"` +url +`")`

	return ar.crud.UpdateDB(c, query)
}

// 編集
func (ar *activityRepository) Update(
	c context.Context,
	id string,
	userID string,
	isDone string,
	sponsorID string,
	feature string,
	expense string,
	remark string,
	design string,
	url string,
	) error {

	query := `
	UPDATE activities
	SET
		user_id = ` + userID +
		`, is_done = ` + isDone +
		`, sponsor_id = ` + sponsorID +
		`, feature = "` + feature +
		`", expense = ` + expense +
		`, remark = "` + remark +
		`", design =` + design +
		`, url ="` + url +
		`" where id = ` + id

	return ar.crud.UpdateDB(c, query)
}

// 削除
func (ar *activityRepository) Destroy(c context.Context, id string) error {
	query := "DELETE FROM activities WHERE id = " + id
	return ar.crud.UpdateDB(c, query)
}

// activityに紐づくsponserとusersを取得する
func (ar *activityRepository) FindDetail(c context.Context) (*sql.Rows, error) {
	query := `
	SELECT * FROM
		activities
	INNER JOIN
		sponsors
	ON
		activities.sponsor_id = sponsors.id
	INNER JOIN
		users
	ON
		activities.user_id = users.id`

	return ar.crud.Read(c, query)
}

// 最新のレコードを取得
func (ar *activityRepository) FindLatestRecord(c context.Context) (*sql.Row, error) {
	query := `
		SELECT
			*
		FROM
			activities
		ORDER BY
			id
		DESC LIMIT 1
	`
	return ar.crud.ReadByID(c, query)
}

// 指定したorder_idのitemを取得する
func (ar *activityRepository) FindSponsorStyle(c context.Context, sponsorStyleID string) (*sql.Rows, error) {
	query := `
		SELECT
			*
		FROM
			activity_styles
		INNER JOIN
			sponsor_styles AS ss
		ON
			activity_styles.sponsor_style_id = ss.id
		WHERE activity_styles.activity_id = ` + sponsorStyleID
	return ar.crud.Read(c, query)
}

// 指定したactivity_idのactivityを取得する
func (ar *activityRepository) FindActivityInformation(c context.Context, activityID string) (*sql.Rows, error) {
	query := "SELECT * FROM activity_informations WHERE activity_id =" + activityID
	return ar.crud.Read(c, query)
}

// 年度別のactivityに紐づくsponserとusersを取得する
func (ar *activityRepository) AllDetailsByPeriod(c context.Context, year string) (*sql.Rows, error) {
	query := `
	SELECT
		activities.*,
		sponsors.*,
		users.*
	FROM
		activities
	INNER JOIN
		sponsors
	ON
		activities.sponsor_id = sponsors.id
	INNER JOIN
		users
	ON
		activities.user_id = users.id
	INNER JOIN
		year_periods
	ON
		activities.created_at > year_periods.started_at
	AND
		activities.created_at < year_periods.ended_at
	INNER JOIN
		years
	ON
		year_periods.year_id = years.id
	WHERE
		years.year = ` + year +
		" ORDER BY activities.updated_at DESC"

	return ar.crud.Read(c, query)
}

// activityに紐づくsponserとusersをフィルタを考慮して取得する
func (ar *activityRepository) FindFilteredDetail(c context.Context, isDone string, sponsorStyleIDs []string, keyword string) (*sql.Rows, error) {
	query := `
	SELECT
		activities.*,
		sponsors.*,
		users.*
	FROM
		activities
	INNER JOIN
		sponsors
	ON
		activities.sponsor_id = sponsors.id
	INNER JOIN
		users
	ON
		activities.user_id = users.id
	INNER JOIN
		activity_styles
	ON
		activities.id = activity_styles.activity_id
	INNER JOIN
		sponsor_styles
	ON
		activity_styles.sponsor_style_id = sponsor_styles.id
	WHERE
		1=1`

	// keywordフィルタを追加
	if keyword != "" {
		query += ` AND
		sponsors.name LIKE '%` + keyword + `%'`
	}

	// isDoneフィルタを追加
	if isDone != "" {
		if isDone != "all" {
			query += ` AND
			activities.is_done = ` + isDone
		}
	}

	// sponsorStyleIDsフィルタを追加
	if len(sponsorStyleIDs) > 0 {
		// プレースホルダーを生成
		placeholders := strings.Join(sponsorStyleIDs, ",")
		query += ` AND
		sponsor_styles.id IN (` + placeholders + `)`
	}

	return ar.crud.Read(c, query)
}

// activityに紐づくsponserとusersをフィルタを考慮して取得する
func (ar *activityRepository) FindFilteredDetailByPeriod(c context.Context, isDone string, sponsorStyleIDs []string, year string, keyword string) (*sql.Rows, error) {
	query := `
	SELECT
		activities.*,
		sponsors.*,
		users.*
	FROM
		activities
	INNER JOIN
		sponsors
	ON
		activities.sponsor_id = sponsors.id
	INNER JOIN
		users
	ON
		activities.user_id = users.id
	INNER JOIN
		activity_styles
	ON
		activities.id = activity_styles.activity_id
	INNER JOIN
		sponsor_styles
	ON
		activity_styles.sponsor_style_id = sponsor_styles.id
	INNER JOIN
		year_periods
	ON
		activities.created_at > year_periods.started_at
	AND
		activities.created_at < year_periods.ended_at
	INNER JOIN
		years
	ON
		year_periods.year_id = years.id
	WHERE
		1=1`

	// keywordフィルタを追加
	if keyword != "" {
		query += ` AND
		sponsors.name LIKE '%` + keyword + `%'`
	}

	// isDoneフィルタを追加
	if isDone != "" {
		if isDone != "all" {
			query += ` AND
			activities.is_done = ` + isDone
		}
	}

	// yearのフィルタ追加
	if year != "" {
		query += ` AND
		years.year = ` + year + " ORDER BY activities.updated_at DESC"
	}

	// sponsorStyleIDsフィルタを追加
	if len(sponsorStyleIDs) > 0 {
		// プレースホルダーを生成
		placeholders := strings.Join(sponsorStyleIDs, ",")
		query += ` AND
		sponsor_styles.id IN (` + placeholders + `)`
	}

	return ar.crud.Read(c, query)
}