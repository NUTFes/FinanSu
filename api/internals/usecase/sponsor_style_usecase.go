package usecase

import (
	"context"

	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/internals/domain"
)

type sponsorStyleUseCase struct {
	rep rep.SponsorStyleRepository
}

type SponsorStyleUseCase interface {
	GetSponsorStyles(context.Context) ([]domain.SponsorStyle, error)
	GetSponsorStylesByID(context.Context, string) (domain.SponsorStyle, error)
	CreateSponsorStyle(context.Context, string, string, int) (domain.SponsorStyle, error)
	UpdateSponsorStyle(context.Context, string, string, string, int) (domain.SponsorStyle, error)
	DestroySponsorStyle(context.Context, string) error
}

func NewSponsorStyleUseCase(rep rep.SponsorStyleRepository) SponsorStyleUseCase {
	return &sponsorStyleUseCase{rep}
}

// Sponsorstylesの取得(Gets)
func (s *sponsorStyleUseCase) GetSponsorStyles(c context.Context) ([]domain.SponsorStyle, error) {
	sponsorStyle := domain.SponsorStyle{}
	var sponsorStyles []domain.SponsorStyle
	rows, err := s.rep.All(c)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		err := rows.Scan(
			&sponsorStyle.ID,
			&sponsorStyle.Style,
			&sponsorStyle.Feature,
			&sponsorStyle.Price,
			&sponsorStyle.IsDeleted,
			&sponsorStyle.CreatedAt,
			&sponsorStyle.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		sponsorStyles = append(sponsorStyles, sponsorStyle)
	}
	return sponsorStyles, nil
}

// SponsorStyleの取得(Get)
func (s *sponsorStyleUseCase) GetSponsorStylesByID(c context.Context, id string) (domain.SponsorStyle, error) {
	sponsorStyle := domain.SponsorStyle{}
	row, err := s.rep.Find(c, id)
	err = row.Scan(
		&sponsorStyle.ID,
		&sponsorStyle.Style,
		&sponsorStyle.Feature,
		&sponsorStyle.Price,
		&sponsorStyle.IsDeleted,
		&sponsorStyle.CreatedAt,
		&sponsorStyle.UpdatedAt,
	)
	if err != nil {
		return sponsorStyle, err
	}
	return sponsorStyle, nil
}

// SponsorStyleの作成(Create)
func (s *sponsorStyleUseCase) CreateSponsorStyle(
	c context.Context,
	Style string,
	Feature string,
	Price int,
) (domain.SponsorStyle, error) {
	latastSponsorStyle := domain.SponsorStyle{}
	err := s.rep.Create(c, Style, Feature, Price)
	row, err := s.rep.FindLatestRecord(c)
	err = row.Scan(
		&latastSponsorStyle.ID,
		&latastSponsorStyle.Style,
		&latastSponsorStyle.Feature,
		&latastSponsorStyle.Price,
		&latastSponsorStyle.IsDeleted,
		&latastSponsorStyle.CreatedAt,
		&latastSponsorStyle.UpdatedAt,
	)
	if err != nil {
		return latastSponsorStyle, err
	}
	return latastSponsorStyle, err
}

// SponsorStyleの編集(Update)
func (s *sponsorStyleUseCase) UpdateSponsorStyle(
	c context.Context,
	id string,
	Style string,
	Feature string,
	Price int,
) (domain.SponsorStyle, error) {
	updatedSponsorStyle := domain.SponsorStyle{}
	err := s.rep.Update(c, id, Style, Feature, Price)
	row, err := s.rep.Find(c, id)
	err = row.Scan(
		&updatedSponsorStyle.ID,
		&updatedSponsorStyle.Style,
		&updatedSponsorStyle.Feature,
		&updatedSponsorStyle.Price,
		&updatedSponsorStyle.IsDeleted,
		&updatedSponsorStyle.CreatedAt,
		&updatedSponsorStyle.UpdatedAt,
	)
	if err != nil {
		return updatedSponsorStyle, err
	}
	return updatedSponsorStyle, err
}

// SponsorStyleの削除(Delate)
func (s *sponsorStyleUseCase) DestroySponsorStyle(
	c context.Context,
	id string,
) error {
	err := s.rep.Delete(c, id)
	return err
}
