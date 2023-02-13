package usecase

import (
	"context"
	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/pkg/errors"
)

type yearUseCase struct {
	rep rep.YearRepository
}

type YearUseCase interface {
	GetYears(context.Context) ([]domain.Year, error)
	GetYearByID(context.Context, string) (domain.Year, error)
	CreateYear(context.Context, string) (domain.Year, error)
	UpdateYear(context.Context, string, string) (domain.Year, error)
	DestroyYear(context.Context, string) error
}

func NewYearUseCase(rep rep.YearRepository) YearUseCase {
	return &yearUseCase{rep}
}

func (y *yearUseCase) GetYears(c context.Context) ([]domain.Year, error) {

	year := domain.Year{}
	var years []domain.Year

	// クエリー実行
	rows, err := y.rep.All(c)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		err := rows.Scan(
			&year.ID,
			&year.Year,
			&year.CreatedAt,
			&year.UpdatedAt,
		)

		if err != nil {
			return nil, errors.Wrapf(err, "cannot connect SQL")
		}

		years = append(years, year)
	}
	return years, nil
}

func (y *yearUseCase) GetYearByID(c context.Context, id string) (domain.Year, error) {
	var year domain.Year

	row, err := y.rep.Find(c, id)
	err = row.Scan(
		&year.ID,
		&year.Year,
		&year.CreatedAt,
		&year.UpdatedAt,
	)

	if err != nil {
		return year, err
	}

	return year, nil
}

func (y *yearUseCase) CreateYear(c context.Context, year string) (domain.Year, error) {
	latestYear := domain.Year{}
	err := y.rep.Create(c, year)
	row, err := y.rep.FindLatestRecord(c)
	err = row.Scan(
		&latestYear.ID,
		&latestYear.Year,
		&latestYear.CreatedAt,
		&latestYear.UpdatedAt,
	)
	if err != nil {
		return latestYear, err
	}
	return latestYear, nil
}

func (y *yearUseCase) UpdateYear(c context.Context, id string, year string) (domain.Year, error) {
	updatedYear := domain.Year{}
	err := y.rep.Update(c, id, year)
	row, err := y.rep.Find(c, id)
	err = row.Scan(
		&updatedYear.ID,
		&updatedYear.Year,
		&updatedYear.CreatedAt,
		&updatedYear.UpdatedAt,
	)
	if err != nil {
		return updatedYear, err
	}
	return updatedYear, nil
}

func (y *yearUseCase) DestroyYear(c context.Context, id string) error {
	err := y.rep.Destroy(c, id)
	return err
}
