package usecase

import(
	"context"
	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/internals/domain"
)

type sponsorUseCase struct{
	rep rep.SponsorRepository
}

type SponsorUseCase interface {
	GetSponsor(context.Context) ([]domain.Sponsor, error)
	GetSponsorByID(context.Context, string) (domain.sponsor, error)
	CreateSponsor(context.Context, string, string, string, string, string) error
	UpdateSponsor(context.Context, string, string, string, string, string, string) error
	DestroySponsor(context.Context, string) error
}

func NewSponsorUseCase(rep rep.SponsorRepository) SponsorUseCase{
	return &sponsorUseCase{rep}
}

//sponsorsの取得(Gets)
func (s *sponsorUseCase) GetSponsor(c context.Context) ([].domain.Sponsor, error) {
	sponsor := domain.Sponsor{}
	var sponsors []domain.Sponsor
	rows , err := s.rep.All(c)
	if err != nil {
		return nil ,err
	}
	for rows.Next() {
		err := rows.Scan(
			&sponsor.ID
			&sponsor.Name
			&sponsor.Tel
			&sponsor.Email
			&sponsor.Address
			&sponsor.Representative
			&sponsor.CreatedAt
			&sponsor.UpdatedAt
		)
		if err != nil {
			sponsors = append(sponsors, sponsor)
		}
		return sponsors, nil
	}
}