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
	//活動一覧の基本データを取得
	activities, err := u.repo.All(ctx, params)
	if err != nil {
		return nil, err
	}

	//取得した活動ごとに、申し込んでいるプランの内訳を取得・セット
	for i := range activities {
		styles, err := u.repo.GetStyleDetailsByActivityID(ctx, activities[i].ID)
		if err != nil {
			return nil, err
		}
		//「未着手」用
		if styles == nil {
			styles = []domain.SponsorStyleDetail{}
		}
		activities[i].SponsorStyles = styles
	}

	// 検索結果が0件の時用
	if activities == nil {
		activities = []domain.SponsorshipActivity{}
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
