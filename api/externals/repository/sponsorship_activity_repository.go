package repository

import (
	"context"
	"database/sql"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	goqu "github.com/doug-martin/goqu/v9"
	_ "github.com/doug-martin/goqu/v9/dialect/mysql"
)

var selectSponsorshipActivityQuery = goqu.Dialect("mysql").
	Select(
		"sa.id", "sa.year_periods_id", "sa.sponsor_id", "sa.user_id", "sa.activity_status", "sa.feasibility_status", "sa.design_progress", "sa.remarks", "sa.created_at", "sa.updated_at",
		"s.id", "s.name", "s.tel", "s.email", "s.address", "s.representative", "s.created_at", "s.updated_at",
		"u.id", "u.name", "u.bureau_id", "u.role_id", "u.is_deleted", "u.created_at", "u.updated_at",
	).
	From(goqu.T("sponsorship_activities").As("sa")).
	InnerJoin(goqu.T("sponsors").As("s"), goqu.On(goqu.I("sa.sponsor_id").Eq(goqu.I("s.id")))).
	InnerJoin(goqu.T("users").As("u"), goqu.On(goqu.I("sa.user_id").Eq(goqu.I("u.id"))))

type SponsorshipActivityRepository interface {
	FindAll(ctx context.Context, params domain.SponsorshipActivityParams) ([]domain.SponsorshipActivity, error)
	GetStyleDetailsByActivityIDs(ctx context.Context, activityIDs []int) ([]domain.SponsorStyleDetail, error)
	FindByID(ctx context.Context, id int) (domain.SponsorshipActivity, error)
	Begin(ctx context.Context) (*sql.Tx, error)
	Create(ctx context.Context, tx *sql.Tx, activity domain.SponsorshipActivity) (int, error)
	CreateStyleLink(ctx context.Context, tx *sql.Tx, link domain.SponsorStyleDetail) error
	Update(ctx context.Context, activity domain.SponsorshipActivity) error
	UpdateStatus(ctx context.Context, id int, activity domain.SponsorshipActivity) error
	Delete(ctx context.Context, id int) error
}

type sponsorshipActivityRepository struct {
	client db.Client
	crud   abstract.Crud
}

func NewSponsorshipActivityRepository(client db.Client, crud abstract.Crud) SponsorshipActivityRepository {
	return &sponsorshipActivityRepository{
		client: client,
		crud:   crud,
	}
}

func (r *sponsorshipActivityRepository) FindAll(ctx context.Context, params domain.SponsorshipActivityParams) ([]domain.SponsorshipActivity, error) {
	// ベースSQL
	dataset := selectSponsorshipActivityQuery

	// 絞り込み条件の追加
	if params.YearPeriodsID != nil {
		dataset = dataset.Where(goqu.I("sa.year_periods_id").Eq(*params.YearPeriodsID))
	}
	if params.UserID != nil {
		dataset = dataset.Where(goqu.I("sa.user_id").Eq(*params.UserID))
	}
	if params.ActivityStatus != nil {
		dataset = dataset.Where(goqu.I("sa.activity_status").Eq(*params.ActivityStatus))
	}
	if params.FeasibilityStatus != nil {
		dataset = dataset.Where(goqu.I("sa.feasibility_status").Eq(*params.FeasibilityStatus))
	}
	// 企業名の部分一致検索
	if params.Keyword != nil && *params.Keyword != "" {
		likePattern := "%" + *params.Keyword + "%"
		dataset = dataset.Where(goqu.I("s.name").Like(likePattern))
	}

	// 協賛プランID
	if len(params.SponsorStyleIDs) > 0 {
		dataset = dataset.Where(
			goqu.L("EXISTS ?", goqu.Dialect("mysql").
				Select(goqu.I("l.sponsorship_activity_id")).
				From(goqu.T("activity_sponsor_style_links").As("l")).
				Where(
					goqu.I("l.sponsorship_activity_id").Eq(goqu.I("sa.id")),
					goqu.I("l.sponsor_style_id").In(params.SponsorStyleIDs),
				),
			),
		)
	}

	// ソート順の指定
	if params.Sort != nil && params.Order != nil {
		//許可するカラム名のみを処理する
		switch *params.Sort {
		case "id", "year_periods_id", "sponsor_id", "user_id", "activity_status", "feasibility_status", "design_progress", "created_at", "updated_at":
			col := goqu.I("sa." + *params.Sort)
			if *params.Order == "asc" {
				dataset = dataset.Order(col.Asc())
			} else {
				dataset = dataset.Order(col.Desc())
			}
		default:
			dataset = dataset.Order(goqu.I("sa.id").Desc())
		}
	} else {
		// デフォルトはID降順
		dataset = dataset.Order(goqu.I("sa.id").Desc())
	}

	query, args, err := dataset.ToSQL()
	if err != nil {
		return nil, err
	}

	rows, err := r.client.DB().QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var activities []domain.SponsorshipActivity
	for rows.Next() {
		var a domain.SponsorshipActivity
		var s domain.Sponsor
		var u domain.User
		var remarks sql.NullString

		err := rows.Scan(
			&a.ID, &a.YearPeriodsID, &a.SponsorID, &a.UserID, &a.ActivityStatus, &a.FeasibilityStatus, &a.DesignProgress, &remarks, &a.CreatedAt, &a.UpdatedAt,
			&s.ID, &s.Name, &s.Tel, &s.Email, &s.Address, &s.Representative, &s.CreatedAt, &s.UpdatedAt,
			&u.ID, &u.Name, &u.BureauID, &u.RoleID, &u.IsDeleted, &u.CreatedAt, &u.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		// 値が存在する場合のみ文字列として格納
		if remarks.Valid {
			a.Remarks = remarks.String
		}
		a.Sponsor = s
		a.User = u
		activities = append(activities, a)
	}
	return activities, nil
}

// 特定の活動IDに紐づくプラン内訳を取得
func (r *sponsorshipActivityRepository) GetStyleDetailsByActivityIDs(ctx context.Context, activityIDs []int) ([]domain.SponsorStyleDetail, error) {
	dataset := goqu.Dialect("mysql").
		Select(
			"l.id", "l.sponsorship_activity_id", "l.sponsor_style_id", "l.category", // sponsorship_activity_id を含める
			"ss.id", "ss.style", "ss.feature", "ss.price", "ss.is_deleted", "ss.created_at", "ss.updated_at",
		).
		From(goqu.T("activity_sponsor_style_links").As("l")).
		InnerJoin(goqu.T("sponsor_styles").As("ss"), goqu.On(goqu.I("l.sponsor_style_id").Eq(goqu.I("ss.id")))).
		Where(goqu.I("l.sponsorship_activity_id").In(activityIDs))

	query, args, err := dataset.ToSQL()
	if err != nil {
		return nil, err
	}

	rows, err := r.client.DB().QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var details []domain.SponsorStyleDetail
	for rows.Next() {
		var d domain.SponsorStyleDetail
		var ss domain.SponsorStyle
		err := rows.Scan(
			&d.ID, &d.SponsorshipActivityID, &d.SponsorStyleID, &d.Category,
			&ss.ID, &ss.Style, &ss.Feature, &ss.Price, &ss.IsDeleted, &ss.CreatedAt, &ss.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		d.Style = ss
		details = append(details, d)
	}
	return details, nil
}

func (r *sponsorshipActivityRepository) FindByID(ctx context.Context, id int) (domain.SponsorshipActivity, error) {
	dataset := selectSponsorshipActivityQuery.Where(goqu.I("sa.id").Eq(id))

	query, args, err := dataset.ToSQL()
	if err != nil {
		return domain.SponsorshipActivity{}, err
	}

	var a domain.SponsorshipActivity
	var s domain.Sponsor
	var u domain.User
	var remarks sql.NullString

	row := r.client.DB().QueryRowContext(ctx, query, args...)
	err = row.Scan(
		&a.ID, &a.YearPeriodsID, &a.SponsorID, &a.UserID, &a.ActivityStatus, &a.FeasibilityStatus, &a.DesignProgress, &remarks, &a.CreatedAt, &a.UpdatedAt,
		&s.ID, &s.Name, &s.Tel, &s.Email, &s.Address, &s.Representative, &s.CreatedAt, &s.UpdatedAt,
		&u.ID, &u.Name, &u.BureauID, &u.RoleID, &u.IsDeleted, &u.CreatedAt, &u.UpdatedAt,
	)
	if err != nil {
		return domain.SponsorshipActivity{}, err
	}

	if remarks.Valid {
		a.Remarks = remarks.String
	}
	a.Sponsor = s
	a.User = u

	return a, nil
}

// トランザクション開始
func (r *sponsorshipActivityRepository) Begin(ctx context.Context) (*sql.Tx, error) {
	return r.client.DB().BeginTx(ctx, nil)
}

// 登録
func (r *sponsorshipActivityRepository) Create(ctx context.Context, tx *sql.Tx, a domain.SponsorshipActivity) (int, error) {
	dataset := goqu.Dialect("mysql").Insert("sponsorship_activities").Rows(
		goqu.Record{
			"year_periods_id":    a.YearPeriodsID,
			"sponsor_id":         a.SponsorID,
			"user_id":            a.UserID,
			"activity_status":    a.ActivityStatus,
			"feasibility_status": a.FeasibilityStatus,
			"design_progress":    a.DesignProgress,
			"remarks":            a.Remarks,
		},
	)

	query, args, err := dataset.ToSQL()
	if err != nil {
		return 0, err
	}

	result, err := tx.ExecContext(ctx, query, args...)
	if err != nil {
		return 0, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return int(id), nil
}

// 協賛活動とプランの紐付け登録
func (r *sponsorshipActivityRepository) CreateStyleLink(ctx context.Context, tx *sql.Tx, l domain.SponsorStyleDetail) error {
	dataset := goqu.Dialect("mysql").Insert("activity_sponsor_style_links").Rows(
		goqu.Record{
			"sponsorship_activity_id": l.SponsorshipActivityID,
			"sponsor_style_id":        l.SponsorStyleID,
			"category":                l.Category,
		},
	)

	query, args, err := dataset.ToSQL()
	if err != nil {
		return err
	}

	_, err = tx.ExecContext(ctx, query, args...)
	return err
}

func (r *sponsorshipActivityRepository) Update(ctx context.Context, activity domain.SponsorshipActivity) error {
	return nil
}

func (r *sponsorshipActivityRepository) UpdateStatus(ctx context.Context, id int, activity domain.SponsorshipActivity) error {
	return nil
}

func (r *sponsorshipActivityRepository) Delete(ctx context.Context, id int) error {
	return nil
}
