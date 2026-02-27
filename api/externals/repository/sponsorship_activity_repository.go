package repository

import (
	"context"
	"database/sql"

	//"fmt"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	goqu "github.com/doug-martin/goqu/v9"
	_ "github.com/doug-martin/goqu/v9/dialect/mysql"
)

type SponsorshipActivityRepository interface {
	All(ctx context.Context, params domain.SponsorshipActivityParams) ([]domain.SponsorshipActivity, error)
	GetStyleDetailsByActivityIDs(ctx context.Context, activityIDs []int) ([]domain.SponsorStyleDetail, error)
	Find(ctx context.Context, id int) (domain.SponsorshipActivity, error)
	Create(ctx context.Context, activity domain.SponsorshipActivity) (int, error)
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

func (r *sponsorshipActivityRepository) All(ctx context.Context, params domain.SponsorshipActivityParams) ([]domain.SponsorshipActivity, error) {
	// ベースSQL
	dataset := goqu.Dialect("mysql").
		Select(
			"sa.id", "sa.year_periods_id", "sa.sponsor_id", "sa.user_id", "sa.activity_status", "sa.feasibility_status", "sa.design_progress", "sa.remarks", "sa.created_at", "sa.updated_at",
			"s.id", "s.name", "s.tel", "s.email", "s.address", "s.representative", "s.created_at", "s.updated_at",
			"u.id", "u.name", "u.bureau_id", "u.role_id", "u.is_deleted", "u.created_at", "u.updated_at",
		).
		From(goqu.T("sponsorship_activities").As("sa")).
		InnerJoin(goqu.T("sponsors").As("s"), goqu.On(goqu.I("sa.sponsor_id").Eq(goqu.I("s.id")))).
		InnerJoin(goqu.T("users").As("u"), goqu.On(goqu.I("sa.user_id").Eq(goqu.I("u.id"))))

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
	//テスト用
	//fmt.Printf("\n[DEBUG SQL Activities]: %s\n", query)

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
	//テスト用
	//fmt.Printf("[DEBUG SQL Styles (N+1 check)]: %s\n\n", query)

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

func (r *sponsorshipActivityRepository) Find(ctx context.Context, id int) (domain.SponsorshipActivity, error) {
	return domain.SponsorshipActivity{}, nil
}

func (r *sponsorshipActivityRepository) Create(ctx context.Context, activity domain.SponsorshipActivity) (int, error) {
	return 0, nil
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
