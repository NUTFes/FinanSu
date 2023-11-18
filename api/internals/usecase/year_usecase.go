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
	GetYearPeriods(context.Context) ([]domain.YearPeriod, error)
	CreateYearPeriod(context.Context, string, string, string) (domain.YearPeriod, error)
	UpdateYearPeriod(context.Context, string, string, string, string) (domain.YearPeriod, error)
	DestroyYearPeriod(context.Context, string) error
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


func (y *yearUseCase) GetYearPeriods(c context.Context) ([]domain.YearPeriod, error) {
	yearPeriod := domain.YearPeriod{}
	var yearPeriods []domain.YearPeriod
	rows, err := y.rep.AllYearPeriods(c)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		err := rows.Scan(
			&yearPeriod.ID,
			&yearPeriod.Year,
			&yearPeriod.StartedAt,
			&yearPeriod.EndedAt,			
			&yearPeriod.CreatedAt,
			&yearPeriod.UpdatedAt,
		)
		if err != nil {
			return nil, errors.Wrapf(err, "cannot connect SQL")
		}

		yearPeriods = append(yearPeriods, yearPeriod)
	}
	return yearPeriods, nil
}

func (y *yearUseCase) CreateYearPeriod(c context.Context, year string, startAt string, endedAt string) (domain.YearPeriod, error) {
	latestYearPeriod := domain.YearPeriod{}
	err := y.rep.CreateYearPeriod(c, year, startAt, endedAt)
	row, err := y.rep.FindPeriodLatestRecord(c)
	err = row.Scan(
		&latestYearPeriod.ID,
		&latestYearPeriod.Year,
		&latestYearPeriod.StartedAt,
		&latestYearPeriod.EndedAt,			
		&latestYearPeriod.CreatedAt,
		&latestYearPeriod.UpdatedAt,
	)
	if err != nil {
		return latestYearPeriod, err
	}
	return latestYearPeriod, nil
}

func (y *yearUseCase) UpdateYearPeriod(c context.Context, id string, year string, startAt string, endedAt string) (domain.YearPeriod, error) {
	updateYearPeriod := domain.YearPeriod{}
	err := y.rep.UpdateYearPeriod(c, id, year, startAt, endedAt)
	row, err := y.rep.FindYearPeriodByID(c, id)
	err = row.Scan(
		&updateYearPeriod.ID,
		&updateYearPeriod.Year,
		&updateYearPeriod.StartedAt,
		&updateYearPeriod.EndedAt,			
		&updateYearPeriod.CreatedAt,
		&updateYearPeriod.UpdatedAt,
	)
	if err != nil {
		return updateYearPeriod, err
	}
	return updateYearPeriod, nil
}

func (y *yearUseCase) DestroyYearPeriod(c context.Context, id string) error {
	err := y.rep.DestroyYearPeriod(c, id)
	return err
}
