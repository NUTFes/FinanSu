package usecase

import (
	"context"

	"github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/internals/domain"
)

type SponsorshipActivityUseCase interface {
	GetSponsorshipActivities(ctx context.Context, params domain.SponsorshipActivityParams) ([]domain.SponsorshipActivity, error)
	GetSponsorshipActivityByID(ctx context.Context, id int) (domain.SponsorshipActivity, error)
	CreateSponsorshipActivity(ctx context.Context, activity domain.SponsorshipActivity) (domain.SponsorshipActivity, error)
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
	activities, err := u.repo.All(ctx, params)
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
	return u.repo.Find(ctx, id)
}

func (u *sponsorshipActivityUseCase) CreateSponsorshipActivity(ctx context.Context, activity domain.SponsorshipActivity) (domain.SponsorshipActivity, error) {
	u.repo.Create(ctx, activity)
	return activity, nil
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
