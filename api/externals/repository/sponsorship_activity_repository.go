package repository

import (
	"context"
	"database/sql"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
	"github.com/NUTFes/FinanSu/api/generated"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	goqu "github.com/doug-martin/goqu/v9"
	_ "github.com/doug-martin/goqu/v9/dialect/mysql"
)

var selectSponsorshipActivityQuery = goqu.Dialect("mysql").
	Select(
		"sponsorship_activities.id", "sponsorship_activities.year_periods_id", "sponsorship_activities.sponsor_id",
		"sponsorship_activities.user_id", "sponsorship_activities.activity_status", "sponsorship_activities.feasibility_status",
		"sponsorship_activities.design_progress", "sponsorship_activities.remarks",
		"sponsorship_activities.created_at", "sponsorship_activities.updated_at",
		"sponsors.name", "sponsors.tel", "sponsors.email", "sponsors.address", "sponsors.representative",
		"users.id", "users.name", "users.bureau_id", "users.role_id", "users.is_deleted", "users.created_at", "users.updated_at",
	).
	From("sponsorship_activities").
	InnerJoin(goqu.T("sponsors"), goqu.On(goqu.I("sponsorship_activities.sponsor_id").Eq(goqu.I("sponsors.id")))).
	InnerJoin(goqu.T("users"), goqu.On(goqu.I("sponsorship_activities.user_id").Eq(goqu.I("users.id"))))

type SponsorshipActivityRepository interface {
	FindAll(ctx context.Context, params generated.GetSponsorshipActivitiesParams) ([]generated.SponsorshipActivity, error)
	GetSponsorStyleMapBySponsorshipActivityIDs(ctx context.Context, sponsorshipActivityIDs []int) (map[int][]generated.ActivitySponsorStyleLink, error)
	GetSponsorStyleLinksBySponsorshipActivityID(ctx context.Context, sponsorshipActivityID int) (domain.SponsorStyleLinks, error)
	FindByID(ctx context.Context, id int) (generated.SponsorshipActivity, error)
	Create(ctx context.Context, tx *sql.Tx, sponsorshipActivity generated.SponsorshipActivity) (int, error)
	CreateSponsorStyleLink(ctx context.Context, tx *sql.Tx, sponsorStyleLink generated.ActivitySponsorStyleLink, sponsorshipActivityID int) error
	Update(ctx context.Context, tx *sql.Tx, activity domain.SponsorshipActivity) error
	DeleteSponsorStyleLinkByID(ctx context.Context, tx *sql.Tx, id int) error
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

func (r *sponsorshipActivityRepository) FindAll(ctx context.Context, sponsorshipActivitiesSearchParams generated.GetSponsorshipActivitiesParams) ([]generated.SponsorshipActivity, error) {
	queryDataset := selectSponsorshipActivityQuery

	// 検索パラメータに基づく協賛活動の絞り込み
	if sponsorshipActivitiesSearchParams.YearPeriodsId != nil {
		queryDataset = queryDataset.Where(goqu.I("sponsorship_activities.year_periods_id").Eq(*sponsorshipActivitiesSearchParams.YearPeriodsId))
	}
	if sponsorshipActivitiesSearchParams.UserId != nil {
		queryDataset = queryDataset.Where(goqu.I("sponsorship_activities.user_id").Eq(*sponsorshipActivitiesSearchParams.UserId))
	}
	if sponsorshipActivitiesSearchParams.ActivityStatus != nil {
		queryDataset = queryDataset.Where(goqu.I("sponsorship_activities.activity_status").Eq(string(*sponsorshipActivitiesSearchParams.ActivityStatus)))
	}
	if sponsorshipActivitiesSearchParams.FeasibilityStatus != nil {
		queryDataset = queryDataset.Where(goqu.I("sponsorship_activities.feasibility_status").Eq(string(*sponsorshipActivitiesSearchParams.FeasibilityStatus)))
	}
	if sponsorshipActivitiesSearchParams.Keyword != nil && *sponsorshipActivitiesSearchParams.Keyword != "" {
		likePattern := "%" + *sponsorshipActivitiesSearchParams.Keyword + "%"
		queryDataset = queryDataset.Where(goqu.I("sponsors.name").Like(likePattern))
	}

	// 指定された協賛プランを持つ協賛活動のみに絞り込む
	if sponsorshipActivitiesSearchParams.SponsorStyleIds != nil && len(*sponsorshipActivitiesSearchParams.SponsorStyleIds) > 0 {
		queryDataset = queryDataset.Where(
			goqu.L("EXISTS ?", goqu.Dialect("mysql").
				Select(goqu.I("activity_sponsor_style_links.sponsorship_activity_id")).
				Where(
					goqu.I("activity_sponsor_style_links.sponsorship_activity_id").Eq(goqu.I("sponsorship_activities.id")),
					goqu.I("activity_sponsor_style_links.sponsor_style_id").In(*sponsorshipActivitiesSearchParams.SponsorStyleIds),
				),
			),
		)
	}

	// 協賛活動のソート
	if sponsorshipActivitiesSearchParams.Sort != nil && sponsorshipActivitiesSearchParams.Order != nil {
		switch *sponsorshipActivitiesSearchParams.Sort {
		case "id", "year_periods_id", "sponsor_id", "user_id", "activity_status", "feasibility_status", "design_progress", "created_at", "updated_at":
			sortColumn := goqu.I("sponsorship_activities." + *sponsorshipActivitiesSearchParams.Sort)
			if string(*sponsorshipActivitiesSearchParams.Order) == "asc" {
				queryDataset = queryDataset.Order(sortColumn.Asc())
			} else {
				queryDataset = queryDataset.Order(sortColumn.Desc())
			}
		default:
			queryDataset = queryDataset.Order(goqu.I("sponsorship_activities.id").Desc())
		}
	} else {
		queryDataset = queryDataset.Order(goqu.I("sponsorship_activities.id").Desc())
	}

	sqlString, sqlArgs, err := queryDataset.ToSQL()
	if err != nil {
		return nil, err
	}

	rows, err := r.client.DB().QueryContext(ctx, sqlString, sqlArgs...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// 取得した値を詰め込む
	var retrievedSponsorshipActivities []generated.SponsorshipActivity
	for rows.Next() {
		var currentSponsorshipActivity generated.SponsorshipActivity
		var currentSponsor generated.Sponsor
		var currentUser generated.User
		var temporaryRemarks sql.NullString

		err := rows.Scan(
			&currentSponsorshipActivity.Id, &currentSponsorshipActivity.YearPeriodsId, &currentSponsorshipActivity.SponsorId,
			&currentSponsorshipActivity.UserId,
			&currentSponsorshipActivity.ActivityStatus, &currentSponsorshipActivity.FeasibilityStatus, &currentSponsorshipActivity.DesignProgress, &temporaryRemarks,
			&currentSponsorshipActivity.CreatedAt, &currentSponsorshipActivity.UpdatedAt,
			&currentSponsor.Name, &currentSponsor.Tel, &currentSponsor.Email,
			&currentSponsor.Address, &currentSponsor.Representative,
			&currentUser.Id, &currentUser.Name, &currentUser.BureauID, &currentUser.RoleID, &currentUser.IsDeleted,
			&currentUser.CreatedAt, &currentUser.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		if temporaryRemarks.Valid {
			currentSponsorshipActivity.Remarks = &temporaryRemarks.String
		}

		currentSponsorshipActivity.Sponsor = &currentSponsor
		currentSponsorshipActivity.User = &currentUser

		retrievedSponsorshipActivities = append(retrievedSponsorshipActivities, currentSponsorshipActivity)
	}
	return retrievedSponsorshipActivities, nil
}

// 特定の活動IDに紐づくプラン内訳を取得
func (r *sponsorshipActivityRepository) GetSponsorStyleMapBySponsorshipActivityIDs(ctx context.Context, sponsorshipActivityIDs []int) (map[int][]generated.ActivitySponsorStyleLink, error) {
	queryDataset := goqu.Dialect("mysql").
		Select(
			"activity_sponsor_style_links.id",
			"activity_sponsor_style_links.sponsorship_activity_id",
			"activity_sponsor_style_links.sponsor_style_id",
			"activity_sponsor_style_links.category",
			"sponsor_styles.style", "sponsor_styles.feature", "sponsor_styles.price",
		).
		From("activity_sponsor_style_links").
		InnerJoin(goqu.T("sponsor_styles"), goqu.On(goqu.I("activity_sponsor_style_links.sponsor_style_id").Eq(goqu.I("sponsor_styles.id")))).
		Where(goqu.I("activity_sponsor_style_links.sponsorship_activity_id").In(sponsorshipActivityIDs))

	sqlString, sqlArgs, err := queryDataset.ToSQL()
	if err != nil {
		return nil, err
	}

	rows, err := r.client.DB().QueryContext(ctx, sqlString, sqlArgs...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// 取得した協賛プランを協賛活動IDとグループ化
	sponsorStyleMapBySponsorshipActivityIDs := make(map[int][]generated.ActivitySponsorStyleLink)
	for rows.Next() {
		var currentSponsorStyleLink generated.ActivitySponsorStyleLink
		var currentSponsorStyle generated.SponsorStyle
		var temporaryCategoryString string

		var SponsorshipActivityID int

		err := rows.Scan(
			&currentSponsorStyleLink.Id, &SponsorshipActivityID, &currentSponsorStyleLink.SponsorStyleId,
			&temporaryCategoryString,
			&currentSponsorStyle.Style, &currentSponsorStyle.Feature, &currentSponsorStyle.Price,
		)
		if err != nil {
			return nil, err
		}

		categoryEnum := generated.SponsorStyleCategory(temporaryCategoryString)
		currentSponsorStyleLink.Category = &categoryEnum
		currentSponsorStyleLink.Style = &currentSponsorStyle

		sponsorStyleMapBySponsorshipActivityIDs[SponsorshipActivityID] =
			append(sponsorStyleMapBySponsorshipActivityIDs[SponsorshipActivityID], currentSponsorStyleLink)
	}

	return sponsorStyleMapBySponsorshipActivityIDs, nil
}

// 特定の活動IDに紐づくプランリストを取得
func (r *sponsorshipActivityRepository) GetSponsorStyleLinksBySponsorshipActivityID(ctx context.Context, sponsorshipActivityID int) (domain.SponsorStyleLinks, error) {
	queryDataset := goqu.Dialect("mysql").
		Select(
			"activity_sponsor_style_links.id",
			"activity_sponsor_style_links.category",
			"sponsor_styles.id", "sponsor_styles.style", "sponsor_styles.feature", "sponsor_styles.price",
		).
		From("activity_sponsor_style_links").
		InnerJoin(goqu.T("sponsor_styles"), goqu.On(goqu.I("activity_sponsor_style_links.sponsor_style_id").Eq(goqu.I("sponsor_styles.id")))).
		Where(goqu.I("activity_sponsor_style_links.sponsorship_activity_id").Eq(sponsorshipActivityID)).
		Order(goqu.I("activity_sponsor_style_links.id").Asc())

	sqlString, sqlArgs, err := queryDataset.ToSQL()
	if err != nil {
		return nil, err
	}

	rows, err := r.client.DB().QueryContext(ctx, sqlString, sqlArgs...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	links := domain.NewSponsorStyleLinks()
	for rows.Next() {
		var link domain.SponsorStyleLink
		err := rows.Scan(
			&link.SponsorStyleLinkID,
			&link.Category,
			&link.Style.ID, &link.Style.Style, &link.Style.Feature, &link.Style.Price,
		)
		if err != nil {
			return nil, err
		}
		links = append(links, link)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return links, nil
}

func (r *sponsorshipActivityRepository) FindByID(ctx context.Context, targetSponsorshipActivityID int) (generated.SponsorshipActivity, error) {
	queryDataset := selectSponsorshipActivityQuery.Where(goqu.I("sponsorship_activities.id").Eq(targetSponsorshipActivityID))

	sqlString, sqlArgs, err := queryDataset.ToSQL()
	if err != nil {
		return generated.SponsorshipActivity{}, err
	}

	var SponsorshipActivity generated.SponsorshipActivity
	var Sponsor generated.Sponsor
	var User generated.User
	var temporaryRemarks sql.NullString

	row := r.client.DB().QueryRowContext(ctx, sqlString, sqlArgs...)

	// 取得した値を詰め込む
	err = row.Scan(
		&SponsorshipActivity.Id, &SponsorshipActivity.YearPeriodsId, &SponsorshipActivity.SponsorId, &SponsorshipActivity.UserId,
		&SponsorshipActivity.ActivityStatus, &SponsorshipActivity.FeasibilityStatus, &SponsorshipActivity.DesignProgress,
		&temporaryRemarks, &SponsorshipActivity.CreatedAt, &SponsorshipActivity.UpdatedAt,
		&Sponsor.Name, &Sponsor.Tel, &Sponsor.Email, &Sponsor.Address, &Sponsor.Representative,
		&User.Id, &User.Name, &User.BureauID, &User.RoleID, &User.IsDeleted, &User.CreatedAt, &User.UpdatedAt,
	)
	if err != nil {
		return generated.SponsorshipActivity{}, err
	}

	if temporaryRemarks.Valid {
		SponsorshipActivity.Remarks = &temporaryRemarks.String
	}

	SponsorshipActivity.Sponsor = &Sponsor
	SponsorshipActivity.User = &User

	return SponsorshipActivity, nil
}

// 登録
func (r *sponsorshipActivityRepository) Create(ctx context.Context, tx *sql.Tx, sponsorshipActivity generated.SponsorshipActivity) (int, error) {
	dataset := goqu.Dialect("mysql").Insert("sponsorship_activities").Rows(
		goqu.Record{
			"year_periods_id":    sponsorshipActivity.YearPeriodsId,
			"sponsor_id":         sponsorshipActivity.SponsorId,
			"user_id":            sponsorshipActivity.UserId,
			"activity_status":    sponsorshipActivity.ActivityStatus,
			"feasibility_status": sponsorshipActivity.FeasibilityStatus,
			"design_progress":    sponsorshipActivity.DesignProgress,
			"remarks":            sponsorshipActivity.Remarks,
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
func (r *sponsorshipActivityRepository) CreateSponsorStyleLink(ctx context.Context, tx *sql.Tx, sponsorStyleLink generated.ActivitySponsorStyleLink, sponsorshipActivityID int) error {
	dataset := goqu.Dialect("mysql").Insert("activity_sponsor_style_links").Rows(
		goqu.Record{
			"sponsorship_activity_id": sponsorshipActivityID,
			"sponsor_style_id":        sponsorStyleLink.SponsorStyleId,
			"category":                sponsorStyleLink.Category,
		},
	)

	query, args, err := dataset.ToSQL()
	if err != nil {
		return err
	}

	_, err = tx.ExecContext(ctx, query, args...)
	return err
}

func (r *sponsorshipActivityRepository) Update(ctx context.Context, tx *sql.Tx, activity domain.SponsorshipActivity) error {
	dataset := goqu.Dialect("mysql").Update("sponsorship_activities").
		Set(goqu.Record{
			"year_periods_id":    activity.YearPeriodsID,
			"sponsor_id":         activity.SponsorID,
			"user_id":            activity.UserID,
			"activity_status":    activity.ActivityStatus,
			"feasibility_status": activity.FeasibilityStatus,
			"design_progress":    activity.DesignProgress,
			"remarks":            activity.Remarks,
		}).
		Where(goqu.I("id").Eq(activity.ID))
	query, args, err := dataset.ToSQL()
	if err != nil {
		return err
	}
	_, err = tx.ExecContext(ctx, query, args...)
	return err
}

func (r *sponsorshipActivityRepository) DeleteSponsorStyleLinkByID(ctx context.Context, tx *sql.Tx, id int) error {
	dataset := goqu.Dialect("mysql").Delete("activity_sponsor_style_links").
		Where(goqu.I("id").Eq(id))
	query, args, err := dataset.ToSQL()
	if err != nil {
		return err
	}
	_, err = tx.ExecContext(ctx, query, args...)
	return err
}

func (r *sponsorshipActivityRepository) UpdateStatus(ctx context.Context, id int, activity domain.SponsorshipActivity) error {
	return nil
}

func (r *sponsorshipActivityRepository) Delete(ctx context.Context, id int) error {
	return nil
}
