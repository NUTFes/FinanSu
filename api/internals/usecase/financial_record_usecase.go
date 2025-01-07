package usecase

import (
	"context"

	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/pkg/errors"
)

type financialRecordUseCase struct {
	rep rep.FinancialRecordRepository
}

type FinancialRecordUseCase interface {
	GetFinancialRecords(context.Context) ([]domain.Bureau, error)
	CreateFinancialRecord(context.Context, string) (domain.Bureau, error)
	UpdateFinancialRecord(context.Context, string, string) (domain.Bureau, error)
	DestroyFinancialRecord(context.Context, string) error
}

func NewFinancialRecordUseCase(rep rep.FinancialRecordRepository) FinancialRecordUseCase {
	return &financialRecordUseCase{rep}
}

func (fru *financialRecordUseCase) GetFinancialRecords(c context.Context) ([]domain.Bureau, error) {
	bureau := domain.Bureau{}
	var bureaus []domain.Bureau

	year := "2021"
	//クエリ実行
	rows, err := fru.rep.AllByPeriod(c, year)
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

func (fru *financialRecordUseCase) CreateFinancialRecord(
	c context.Context,
	name string,
) (domain.Bureau, error) {
	latastBureau := domain.Bureau{}
	err := fru.rep.Create(c, name, name, name, name, name)
	row, err := fru.rep.FindLatestRecord(c)
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

func (fru *financialRecordUseCase) UpdateFinancialRecord(
	c context.Context,
	id string,
	name string,
) (domain.Bureau, error) {
	updatedBureau := domain.Bureau{}
	err := fru.rep.Update(c, id, name, name, name, name, name)
	row, err := fru.rep.GetById(c, id)
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

func (fru *financialRecordUseCase) DestroyFinancialRecord(c context.Context, id string) error {
	err := fru.rep.Delete(c, id)
	return err
}
