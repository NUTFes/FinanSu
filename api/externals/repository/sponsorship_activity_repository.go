package repository

import (
	"context"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
	"github.com/NUTFes/FinanSu/api/internals/domain"
)

type SponsorshipActivityRepository interface {
	All(ctx context.Context, params domain.SponsorshipActivityParams) ([]domain.SponsorshipActivity, error)
	Find(ctx context.Context, id int) (domain.SponsorshipActivity, error)
	Create(ctx context.Context, activity domain.SponsorshipActivity) (int, error)
	Update(ctx context.Context, activity domain.SponsorshipActivity) error
	UpdateStatus(ctx context.Context, id int, activity domain.SponsorshipActivity) error // ★追加
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

// 以下、ハリボテ実装

func (r *sponsorshipActivityRepository) All(ctx context.Context, params domain.SponsorshipActivityParams) ([]domain.SponsorshipActivity, error) {
	return []domain.SponsorshipActivity{}, nil
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
