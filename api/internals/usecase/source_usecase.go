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
	CreateSource(context.Context, string) (domain.Source, error)
	UpdateSource(context.Context, string, string) (domain.Source, error)
	DestroySource(context.Context, string) error
}

func NewSourceUseCase(rep rep.SourceRepository) SourceUseCase {
	return &sourceUseCase{rep}
}

func (s *sourceUseCase) GetSources(c context.Context) ([]domain.Source, error) {
	source := domain.Source{}
	var sources []domain.Source
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
	source := domain.Source{}
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

func (s *sourceUseCase) CreateSource(c context.Context, name string) (domain.Source, error) {
	latastSource := domain.Source{}
	err := s.rep.Create(c, name)
	row, err := s.rep.FindLatestRecord(c)
	err = row.Scan(
		&latastSource.ID,
		&latastSource.Name,
		&latastSource.CreatedAt,
		&latastSource.UpdatedAt,
	)
	if err != nil {
		return latastSource, err
	}
	return latastSource, err
}

func (s *sourceUseCase) UpdateSource(c context.Context, id string, name string) (domain.Source, error) {
	updatedSource := domain.Source{}
	err := s.rep.Update(c, id, name)
	row, err := s.rep.Find(c, id)
	err = row.Scan(
		&updatedSource.ID,
		&updatedSource.Name,
		&updatedSource.CreatedAt,
		&updatedSource.UpdatedAt,
	)
	if err != nil {
		return updatedSource, err
	}
	return updatedSource, err
}

func (s *sourceUseCase) DestroySource(c context.Context, id string) error {
	err := s.rep.Destroy(c, id)
	return err
}
