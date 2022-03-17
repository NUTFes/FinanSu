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
	GetSponsorByID(context.Context, string) (domain.Sponsor, error)
	CreateSponsor(context.Context, string, string, string, string, string) error
	UpdateSponsor(context.Context, string, string, string, string, string, string) error
	DestroySponsor(context.Context, string) error
}

func NewSponsorUseCase(rep rep.SponsorRepository) SponsorUseCase {
	return &sponsorUseCase{rep}
}

//sponsorsの取得(Gets)
func (s *sponsorUseCase) GetSponsor(c context.Context) ([]domain.Sponsor, error) {
	sponsor := domain.Sponsor{}
	var sponsors []domain.Sponsor
	rows , err := s.rep.All(c)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		err := rows.Scan(
      &sponsor.ID,
      &sponsor.Name,
      &sponsor.Tel,
      &sponsor.Email,
      &sponsor.Address,
      &sponsor.Representative,
      &sponsor.CreatedAt,
      &sponsor.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		sponsors = append(sponsors, sponsor)
	}
	return sponsors , nil
}

//sponsorの取得(Get)
func (s *sponsorUseCase) GetSponsorByID(c context.Context, id string) (domain.Sponsor, error) {
	sponsor := domain.Sponsor{}
	row , err := s.rep.Find(c, id)
	err = row.Scan(
		&sponsor.ID,
		&sponsor.Name,
		&sponsor.Tel,
		&sponsor.Email,
		&sponsor.Address,
		&sponsor.Representative,
		&sponsor.CreatedAt,
		&sponsor.UpdatedAt,
	)
	if err != nil {
		return sponsor ,err
	}
	return sponsor, nil
}

//sponsorの作成(create)
func (s *sponsorUseCase) CreateSponsor(
	c context.Context,
	Name string,
	Tel string,
	Email string,
	Address string,
	Representative string,
)error {
	err := s.rep.Create(c, Name, Tel, Email, Address, Representative)
	return err
}

//sponsorの編集(Update)
func (s *sponsorUseCase) UpdateSponsor(
	c context.Context,
	id string,
	Name string,
	Tel string,
	Email string,
	Address string,
	Representative string,
)error {
	err := s.rep.Update(c, id, Name, Tel, Email, Address, Representative)
	return err
}

// //sponsorの削除(delete)
func (s *sponsorUseCase) DestroySponsor(
	c context.Context,
	id string,
)error {
	err := s.rep.Delete(c, id)
	return err
}
