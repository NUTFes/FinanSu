package usecase

import (
	"context"
	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/pkg/errors"
)

type sourceUseCase struct {
	rep rep.SourceRepository
}

type SourceUseCase interface {
	GetSources(context.Context) ([]domain.Source, error)
	GetSourceByID(context.Context, string) (domain.Source, error)
	CreateSource(context.Context, string) error
	UpdateSource(context.Context, string, string) error
	DestroySource(context.Context, string) error
}

func NewSourceUsecase(rep rep.SourceRepository) SourceUseCase {
	return &sourceUseCase{rep}
}

func (s *sourceUseCase) GetSources(c context.Context) ([]domain.Source, error) {

	source := domain.Source{}
	var sources []domain.Source

	// クエリー実行
	rows, err := s.rep.All(c)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		err := rows.Scan(
			&source.ID,
			&source.Name,
			&source.CreatedAt,
			&source.UpdatedAt,
		)

		if err != nil {
			return nil, errors.Wrapf(err, "cannot connect SQL")
		}

		sources = append(sources, source)
	}
	return sources, nil
}

func (s *sourceUseCase) GetSourceByID(c context.Context, id string) (domain.Source, error) {
	var source domain.Source

	row, err := s.rep.Find(c, id)
	err = row.Scan(
		&source.ID,
		&source.Name,
		&source.CreatedAt,
		&source.UpdatedAt,
	)

	if err != nil {
		return source, err
	}

	return source, nil
}

func (s *sourceUseCase) CreateSource(c context.Context, name string) error {
	err := s.rep.Create(c, name)
	return err
}

func (s *sourceUseCase) UpdateSource(c context.Context, id string, name string) error {
	err := s.rep.Update(c, id, name)
	return err
}

func (s *sourceUseCase) DestroySource(c context.Context, id string) error {
	err := s.rep.Destroy(c, id)
	return err
}
