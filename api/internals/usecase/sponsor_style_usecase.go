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
	CreateSponsorStyle(context.Context, string, string, string) (domain.SponsorStyle, error)
	UpdateSponsorStyle(context.Context, string, string, string, string) (domain.SponsorStyle, error)
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
			&sponsorStyle.Scale,
			&sponsorStyle.IsColor,
			&sponsorStyle.Price,
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
		&sponsorStyle.Scale,
		&sponsorStyle.IsColor,
		&sponsorStyle.Price,
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
	Scale string,
	IsColor string,
	Price string,
) (domain.SponsorStyle, error) {
	latastSponsorStyle := domain.SponsorStyle{}
	err := s.rep.Create(c, Scale, IsColor, Price)
	row, err := s.rep.FindLatestRecord(c)
	err = row.Scan(
		&latastSponsorStyle.ID,
		&latastSponsorStyle.Scale,
		&latastSponsorStyle.IsColor,
		&latastSponsorStyle.Price,
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
	Scale string,
	IsColor string,
	Price string,
) (domain.SponsorStyle, error) {
	updatedSponsorStyle := domain.SponsorStyle{}
	err := s.rep.Update(c, id, Scale, IsColor, Price)
	row, err := s.rep.Find(c, id)
	err = row.Scan(
		&updatedSponsorStyle.ID,
		&updatedSponsorStyle.Scale,
		&updatedSponsorStyle.IsColor,
		&updatedSponsorStyle.Price,
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
