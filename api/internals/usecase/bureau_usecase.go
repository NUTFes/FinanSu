package usecase

import (
	"context"

	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/pkg/errors"
)

type bureauUseCase struct {
	rep rep.BureauRepository
}

type BureauUseCase interface {
	GetBureaus(context.Context) ([]domain.Bureau, error)
	GetBureauByID(context.Context, string) (domain.Bureau, error)
	CreateBureau(context.Context, string) (domain.Bureau, error)
	UpdateBureau(context.Context, string, string) (domain.Bureau, error)
	DestroyBureau(context.Context, string) error
}

func NewBureauUseCase(rep rep.BureauRepository) BureauUseCase {
	return &bureauUseCase{rep}
}

func (b *bureauUseCase) GetBureaus(c context.Context) ([]domain.Bureau, error) {
	bureau := domain.Bureau{}
	var bureaus []domain.Bureau

	//クエリ実行
	rows, err := b.rep.All(c)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		err := rows.Scan(
			&bureau.ID,
			&bureau.Name,
			&bureau.CreatedAt,
			&bureau.UpdatedAt,
		)

		if err != nil {
			return nil, errors.Wrapf(err, "can not connect SQL")
		}
		bureaus = append(bureaus, bureau)
	}
	return bureaus, nil
}

func (b *bureauUseCase) GetBureauByID(c context.Context, id string) (domain.Bureau, error) {
	var bureau domain.Bureau
	row, err := b.rep.Find(c, id)
	err = row.Scan(
		&bureau.ID,
		&bureau.Name,
		&bureau.CreatedAt,
		&bureau.UpdatedAt,
	)
	if err != nil {
		return bureau, err
	}
	return bureau, nil
}

func (b *bureauUseCase) CreateBureau(c context.Context, name string) (domain.Bureau, error) {
	latastBureau := domain.Bureau{}
	err := b.rep.Create(c, name)
	row, err := b.rep.FindLatestRecord(c)
	err = row.Scan(
		&latastBureau.ID,
		&latastBureau.Name,
		&latastBureau.CreatedAt,
		&latastBureau.UpdatedAt,
	)
	if err != nil {
		return latastBureau, err
	}
	return latastBureau, nil
}

func (b *bureauUseCase) UpdateBureau(c context.Context, id string, name string) (domain.Bureau, error) {
	updatedBureau := domain.Bureau{}
	err := b.rep.Update(c, id, name)
	row, err := b.rep.Find(c,id)
	err = row.Scan(
		&updatedBureau.ID,
		&updatedBureau.Name,
		&updatedBureau.CreatedAt,
		&updatedBureau.UpdatedAt,		
	)
	if err != nil {
		return updatedBureau, err
	}
	return updatedBureau, nil
}

func (b *bureauUseCase) DestroyBureau(c context.Context, id string) error {
	err := b.rep.Destroy(c, id)
	return err
}
