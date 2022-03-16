package usecase

import (
	"context"
	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/internals/domain"
)

type sponserStyleUseCase struct{
	rep rep.SponserStyleRepository
}

type SponserStyleUseCase interface {
	GetSponserStyles(context.Context) ([]domain.SponserStyle, error)
	GetSponserStylesByID(context.Context, string) (domain.SponserStyle, error)
	CreateSponserStyle(context.Context, string, string, string) error
	UpdateSponserStyle(context.Context, string, string, string, string) error
	DestorySponserStyle(context.Context, string) error
}

func NewSponserStyleUseCase(rep rep.SponserStyleRepository) SponserStyleUseCase {
	return &sponserStyleUseCase{rep}
}

//Sponserstylesの取得(Gets)
func (s *sponserStyleUseCase) GetSponserStyles(c context.Context) ([]domain.SponserStyle, error) {
	sponserStyle :=domain.SponserStyle{}
	var sponserStyles []domain.SponserStyle
	rows, err := s.rep.All(c)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		err := rows.Scan(
			&sponserStyle.ID,
			&sponserStyle.Scale,
			&sponserStyle.IsColor,
			&sponserStyle.Price,
			&sponserStyle.CreatedAt,
			&sponserStyle.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		sponserStyles = append(sponserStyles, sponserStyle)
	}
	return sponserStyles, nil
}

//SponserStyleの取得(Get)
func (s *sponserStyleUseCase) GetSponserStylesByID(c context.Context, id string) (domain.SponserStyle, error){
	sponserStyle := domain.SponserStyle{}
	row , err := s.rep.Find(c, id)
	err = row.Scan(
		&sponserStyle.ID,
		&sponserStyle.Scale,
		&sponserStyle.IsColor,
		&sponserStyle.Price,
		&sponserStyle.CreatedAt,
		&sponserStyle.UpdatedAt,
	)
	if err != nil {
		return sponserStyle, err
	}
	return sponserStyle, nil
}

//SponserStyleの作成(Create)
func (s *sponserStyleUseCase) CreateSponserStyle(
	c context.Context, 
	Scale string,
	IsColor string,
	Price string,
)error {
	err := s.rep.Create(c, Scale, IsColor, Price)
	return err
}
//SponserStyleの編集(Update)
func (s *sponserStyleUseCase) UpdateSponserStyle(
	c context.Context,
	id string,
	Scale string,
	IsColor string,
	Price string,
)error {
	err := s.rep.Update(c, id, Scale, IsColor, Price)
	return err
}

//SponserStyleの削除(Delate)
func (s *sponserStyleUseCase) DestorySponserStyle(
	c context.Context,
	id string,
)error{
	err := s.rep.Delete(c, id)
	return err
}