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
	DeleteSponsorshipActivity(ctx context.Context, id int) error
}

type sponsorshipActivityUseCase struct {
	repo repository.SponsorshipActivityRepository
}

func NewSponsorshipActivityUseCase(repo repository.SponsorshipActivityRepository) SponsorshipActivityUseCase {
	return &sponsorshipActivityUseCase{repo: repo}
}

// 以下、ハリボテ

func (u *sponsorshipActivityUseCase) GetSponsorshipActivities(ctx context.Context, params domain.SponsorshipActivityParams) ([]domain.SponsorshipActivity, error) {
	return u.repo.All(ctx, params)
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

func (u *sponsorshipActivityUseCase) DeleteSponsorshipActivity(ctx context.Context, id int) error {
	return u.repo.Delete(ctx, id)
}
