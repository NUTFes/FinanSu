package usecase

import (
	"context"

	"github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/generated"
	"github.com/NUTFes/FinanSu/api/internals/domain"
)

type SponsorshipActivityUseCase interface {
	GetSponsorshipActivities(ctx context.Context, params domain.SponsorshipActivityParams) ([]domain.SponsorshipActivity, error)
	GetSponsorshipActivityByID(ctx context.Context, id int) (domain.SponsorshipActivity, error)
	CreateSponsorshipActivity(ctx context.Context, req domain.CreateSponsorshipActivityRequest) (domain.SponsorshipActivity, error)
	UpdateSponsorshipActivity(ctx context.Context, id int, activity domain.SponsorshipActivity) (domain.SponsorshipActivity, error)
	UpdateSponsorshipActivityStatus(ctx context.Context, id int, activity domain.SponsorshipActivity) (domain.SponsorshipActivity, error) // ★追加
	DeleteSponsorshipActivity(ctx context.Context, id int) error
}

type sponsorshipActivityUseCase struct {
	repo repository.SponsorshipActivityRepository
}

func NewSponsorshipActivityUseCase(repo repository.SponsorshipActivityRepository) SponsorshipActivityUseCase {
	return &sponsorshipActivityUseCase{repo: repo}
}

func (u *sponsorshipActivityUseCase) GetSponsorshipActivities(ctx context.Context, params domain.SponsorshipActivityParams) ([]domain.SponsorshipActivity, error) {
	activities, err := u.repo.FindAll(ctx, params)
	if err != nil || len(activities) == 0 {
		return activities, err
	}

	// 活動IDのみを抽出
	ids := make([]int, len(activities))
	for i, a := range activities {
		ids[i] = a.ID
	}

	// 該当するスタイルを一括取得
	allStyles, err := u.repo.GetStyleDetailsByActivityIDs(ctx, ids)
	if err != nil {
		return nil, err
	}

	// マップを作成
	styleMap := make(map[int][]domain.SponsorStyleDetail)
	for _, s := range allStyles {
		styleMap[s.SponsorshipActivityID] = append(styleMap[s.SponsorshipActivityID], s)
	}

	//メモリ上でセット
	for i := range activities {
		if styles, ok := styleMap[activities[i].ID]; ok {
			activities[i].SponsorStyles = styles
		} else {
			activities[i].SponsorStyles = []domain.SponsorStyleDetail{}
		}
	}

	return activities, nil
}

func (u *sponsorshipActivityUseCase) GetSponsorshipActivityByID(ctx context.Context, id int) (domain.SponsorshipActivity, error) {
	// 基本データを取得
	activity, err := u.repo.FindByID(ctx, id)
	if err != nil {
		return domain.SponsorshipActivity{}, err
	}

	// プラン一覧を取得
	styles, err := u.repo.GetStyleDetailsByActivityIDs(ctx, []int{id})
	if err != nil {
		return domain.SponsorshipActivity{}, err
	}

	// 結合して返す
	activity.SponsorStyles = styles
	return activity, nil
}

func (u *sponsorshipActivityUseCase) CreateSponsorshipActivity(ctx context.Context, req domain.CreateSponsorshipActivityRequest) (domain.SponsorshipActivity, error) {
	// 未着手の補完
	if req.ActivityStatus == "" {
		req.ActivityStatus = string(generated.ActivityStatusUnstarted)
	}
	if req.FeasibilityStatus == "" {
		req.FeasibilityStatus = string(generated.Unstarted)
	}
	if req.DesignProgress == "" {
		req.DesignProgress = string(generated.DesignProgressUnstarted)
	}

	// 詰め替え
	activity := domain.SponsorshipActivity{
		YearPeriodsID:     req.YearPeriodsID,
		SponsorID:         req.SponsorID,
		UserID:            req.UserID,
		ActivityStatus:    req.ActivityStatus,
		FeasibilityStatus: req.FeasibilityStatus,
		DesignProgress:    req.DesignProgress,
		Remarks:           req.Remarks,
	}

	// トランザクション開始
	tx, err := u.repo.Begin(ctx)
	if err != nil {
		return domain.SponsorshipActivity{}, err
	}

	defer tx.Rollback()

	// 活動本体を保存し、IDを受け取る
	newID, err := u.repo.Create(ctx, tx, activity)
	if err != nil {
		return domain.SponsorshipActivity{}, err
	}

	// プラン内訳を一つずつ登録
	for _, s := range req.SponsorStyleDetails {
		link := domain.SponsorStyleDetail{
			SponsorshipActivityID: newID,
			SponsorStyleID:        s.SponsorStyleID,
			Category:              s.Category,
		}

		if err := u.repo.CreateStyleLink(ctx, tx, link); err != nil {
			return domain.SponsorshipActivity{}, err
		}
	}

	// コミット
	if err := tx.Commit(); err != nil {
		return domain.SponsorshipActivity{}, err
	}

	// 取得して返す
	return u.GetSponsorshipActivityByID(ctx, newID)
}

func (u *sponsorshipActivityUseCase) UpdateSponsorshipActivity(ctx context.Context, id int, activity domain.SponsorshipActivity) (domain.SponsorshipActivity, error) {
	u.repo.Update(ctx, activity)
	return activity, nil
}

func (u *sponsorshipActivityUseCase) UpdateSponsorshipActivityStatus(ctx context.Context, id int, activity domain.SponsorshipActivity) (domain.SponsorshipActivity, error) {
	u.repo.UpdateStatus(ctx, id, activity)
	return activity, nil
}

func (u *sponsorshipActivityUseCase) DeleteSponsorshipActivity(ctx context.Context, id int) error {
	return u.repo.Delete(ctx, id)
}
