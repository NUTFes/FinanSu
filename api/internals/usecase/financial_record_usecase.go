package usecase

import (
	"context"

	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/generated"
	"github.com/pkg/errors"
)

type financialRecordUseCase struct {
	rep rep.FinancialRecordRepository
}

type FinancialRecordUseCase interface {
	GetFinancialRecords(context.Context) (FinancialRecordDetails, error)
	GetFinancialRecordsByYears(context.Context, string) (FinancialRecordDetails, error)
	CreateFinancialRecord(
		context.Context,
		FinancialRecord,
	) (FinancialRecordWithBalance, error)
	UpdateFinancialRecord(
		context.Context,
		string,
		FinancialRecord,
	) (FinancialRecordWithBalance, error)
	DestroyFinancialRecord(context.Context, string) error
}

func NewFinancialRecordUseCase(rep rep.FinancialRecordRepository) FinancialRecordUseCase {
	return &financialRecordUseCase{rep}
}

func (fru *financialRecordUseCase) GetFinancialRecords(
	c context.Context,
) (FinancialRecordDetails, error) {
	var financialRecordDetails FinancialRecordDetails
	var financialRecords []FinancialRecordWithBalance
	var total Total

	rows, err := fru.rep.All(c)
	if err != nil {
		return financialRecordDetails, errors.Wrapf(err, "can not connect SQL")
	}

	defer rows.Close()

	for rows.Next() {
		var financialRecord FinancialRecordWithBalance
		err := rows.Scan(
			&financialRecord.Id,
			&financialRecord.Name,
			&financialRecord.Year,
			&financialRecord.Budget,
			&financialRecord.Expense,
			&financialRecord.Balance,
		)

		if err != nil {
			return financialRecordDetails, errors.Wrapf(err, "can not connect SQL")
		}
		financialRecords = append(financialRecords, financialRecord)
	}

	// totalを求める
	budgetTotal := 0
	expenseTotal := 0
	balanceTotal := 0

	for _, financialRecord := range financialRecords {
		budgetTotal += *financialRecord.Budget
		expenseTotal += *financialRecord.Expense
		balanceTotal += *financialRecord.Balance
	}

	total.Budget = &budgetTotal
	total.Expense = &expenseTotal
	total.Balance = &balanceTotal

	financialRecordDetails.Total = &total
	financialRecordDetails.FinancialRecords = &financialRecords

	return financialRecordDetails, err
}

func (fru *financialRecordUseCase) GetFinancialRecordsByYears(
	c context.Context,
	year string,
) (FinancialRecordDetails, error) {
	var financialRecordDetails FinancialRecordDetails
	var financialRecords []FinancialRecordWithBalance
	var total Total

	rows, err := fru.rep.AllByPeriod(c, year)
	if err != nil {
		return financialRecordDetails, errors.Wrapf(err, "can not connect SQL")
	}

	defer rows.Close()

	for rows.Next() {
		var financialRecord FinancialRecordWithBalance
		err := rows.Scan(
			&financialRecord.Id,
			&financialRecord.Name,
			&financialRecord.Year,
			&financialRecord.Budget,
			&financialRecord.Expense,
			&financialRecord.Balance,
		)

		if err != nil {
			return financialRecordDetails, errors.Wrapf(err, "can not connect SQL")
		}
		financialRecords = append(financialRecords, financialRecord)
	}

	// totalを求める
	budgetTotal := 0
	expenseTotal := 0
	balanceTotal := 0

	for _, financialRecord := range financialRecords {
		budgetTotal += *financialRecord.Budget
		expenseTotal += *financialRecord.Expense
		balanceTotal += *financialRecord.Balance
	}

	total.Budget = &budgetTotal
	total.Expense = &expenseTotal
	total.Balance = &balanceTotal

	financialRecordDetails.Total = &total
	financialRecordDetails.FinancialRecords = &financialRecords

	return financialRecordDetails, err
}

func (fru *financialRecordUseCase) CreateFinancialRecord(
	c context.Context,
	financialRecord FinancialRecord,
) (FinancialRecordWithBalance, error) {
	latastFinancialRecordWithBalance := FinancialRecordWithBalance{}
	err := fru.rep.Create(c, financialRecord)
	if err != nil {
		return latastFinancialRecordWithBalance, err
	}
	row, err := fru.rep.FindLatestRecord(c)
	if err != nil {
		return latastFinancialRecordWithBalance, err
	}
	err = row.Scan(
		&latastFinancialRecordWithBalance.Id,
		&latastFinancialRecordWithBalance.Name,
		&latastFinancialRecordWithBalance.Year,
		&latastFinancialRecordWithBalance.Budget,
		&latastFinancialRecordWithBalance.Expense,
		&latastFinancialRecordWithBalance.Balance,
	)
	if err != nil {
		return latastFinancialRecordWithBalance, err
	}
	return latastFinancialRecordWithBalance, nil
}

func (fru *financialRecordUseCase) UpdateFinancialRecord(
	c context.Context,
	id string,
	financialRecord FinancialRecord,
) (FinancialRecordWithBalance, error) {
	updateFinancialRecord := FinancialRecordWithBalance{}

	if err := fru.rep.Update(c, id, financialRecord); err != nil {
		return updateFinancialRecord, err
	}

	row, err := fru.rep.GetById(c, id)
	if err != nil {
		return updateFinancialRecord, err
	}

	if err = row.Scan(
		&updateFinancialRecord.Id,
		&updateFinancialRecord.Name,
		&updateFinancialRecord.Year,
		&updateFinancialRecord.Budget,
		&updateFinancialRecord.Expense,
		&updateFinancialRecord.Balance,
	); err != nil {
		return updateFinancialRecord, err
	}

	return updateFinancialRecord, nil
}

func (fru *financialRecordUseCase) DestroyFinancialRecord(c context.Context, id string) error {
	err := fru.rep.Delete(c, id)
	return err
}

type FinancialRecordDetails = generated.FinancialRecordDetails
type FinancialRecord = generated.FinancialRecord
type FinancialRecordWithBalance = generated.FinancialRecordWithBalance
type Total = generated.Total
