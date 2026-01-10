package usecase

import (
	"context"
	"log"

	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/generated"
)

type divisionUseCase struct {
	rep rep.DivisionRepository
}

type DivisionUseCase interface {
	GetDivisions(context.Context, string, string) (DivisionDetails, error)
	GetDivisionOptions(context.Context, string, string) ([]DivisionOption, error)
	GetDivision(context.Context, string) (Division, error)
	CreateDivision(context.Context, Division) (DivisionWithBalance, error)
	UpdateDivision(context.Context, string, Division) (DivisionWithBalance, error)
	DestroyDivision(context.Context, string) error
	GetDivisionsYears(context.Context, string) ([]DivisionOption, error)
}

func NewDivisionUseCase(rep rep.DivisionRepository) DivisionUseCase {
	return &divisionUseCase{rep}
}

func (du divisionUseCase) GetDivisions(c context.Context, year string, financialRecordId string) (DivisionDetails, error) {
	var details DivisionDetails
	var divisions []DivisionWithBalance

	rows, err := du.rep.AllByPeriodAndFinancialRecord(c, year, financialRecordId)
	if err != nil {
		return details, err
	}
	defer func() {
		if err := rows.Close(); err != nil {
			log.Println(err)
		}
	}()

	for rows.Next() {
		var division DivisionWithBalance
		if err := rows.Scan(
			&division.Id,
			&division.Name,
			&division.FinancialRecord,
			&division.Budget,
			&division.Expense,
			&division.Balance,
		); err != nil {
			return details, err
		}
		divisions = append(divisions, division)
	}

	details.Divisions = &divisions

	var total Total
	budgetTotal := 0
	expenseTotal := 0
	balanceTotal := 0

	for _, division := range divisions {
		budgetTotal += *division.Budget
		expenseTotal += *division.Expense
		balanceTotal += *division.Balance
	}

	total.Budget = &budgetTotal
	total.Expense = &expenseTotal
	total.Balance = &balanceTotal
	details.Total = &total

	return details, nil
}

func (du *divisionUseCase) GetDivisionOptions(
	c context.Context,
	year string,
	user_id string,
) ([]DivisionOption, error) {
	var divisionOptions []DivisionOption

	rows, err := du.rep.GetDivisionOptionsByUserId(c, year, user_id)
	if err != nil {
		return divisionOptions, err
	}
	defer func() {
		if err := rows.Close(); err != nil {
			log.Println(err)
		}
	}()

	for rows.Next() {
		var divisionOption DivisionOption
		if err = rows.Scan(
			&divisionOption.DivisionId,
			&divisionOption.Name,
		); err != nil {
			return divisionOptions, err
		}

		divisionOptions = append(divisionOptions, divisionOption)
	}
	return divisionOptions, nil
}

func (du *divisionUseCase) GetDivision(c context.Context, id string) (Division, error) {
	division := Division{}

	row, err := du.rep.GetDivisionById(c, id)
	if err != nil {
		return division, err
	}

	if err = row.Scan(
		&division.Id,
		&division.Name,
		&division.FinancialRecordID,
	); err != nil {
		return division, err
	}

	return division, nil
}

func (du *divisionUseCase) CreateDivision(
	c context.Context,
	division Division,
) (DivisionWithBalance, error) {
	latestDivisionWithBalance := DivisionWithBalance{}

	if err := du.rep.Create(c, division); err != nil {
		return latestDivisionWithBalance, err
	}

	row, err := du.rep.FindLatestRecord(c)
	if err != nil {
		return latestDivisionWithBalance, err
	}

	if err = row.Scan(
		&latestDivisionWithBalance.Id,
		&latestDivisionWithBalance.Name,
		&latestDivisionWithBalance.FinancialRecord,
		&latestDivisionWithBalance.Budget,
		&latestDivisionWithBalance.Expense,
		&latestDivisionWithBalance.Balance,
	); err != nil {
		return latestDivisionWithBalance, err
	}

	return latestDivisionWithBalance, nil
}

func (du *divisionUseCase) UpdateDivision(
	c context.Context,
	id string,
	division Division,
) (DivisionWithBalance, error) {
	updatedDivisionWithBalance := DivisionWithBalance{}

	if err := du.rep.Update(c, id, division); err != nil {
		return updatedDivisionWithBalance, err
	}

	row, err := du.rep.GetById(c, id)
	if err != nil {
		return updatedDivisionWithBalance, err
	}
	if err = row.Scan(
		&updatedDivisionWithBalance.Id,
		&updatedDivisionWithBalance.Name,
		&updatedDivisionWithBalance.FinancialRecord,
		&updatedDivisionWithBalance.Budget,
		&updatedDivisionWithBalance.Expense,
		&updatedDivisionWithBalance.Balance,
	); err != nil {
		return updatedDivisionWithBalance, err
	}

	return updatedDivisionWithBalance, nil
}

func (du *divisionUseCase) DestroyDivision(c context.Context, id string) error {
	if err := du.rep.Delete(c, id); err != nil {
		return err
	}
	return nil
}

func (du *divisionUseCase) GetDivisionsYears(c context.Context, year string) ([]DivisionOption, error) {
	var divisionOptions []DivisionOption

	rows, err := du.rep.GetDivisionsYears(c, year)
	if err != nil {
		return divisionOptions, err
	}
	defer func() {
		if err := rows.Close(); err != nil {
			log.Println(err)
		}
	}()

	for rows.Next() {
		var divisionOption DivisionOption
		if err = rows.Scan(
			&divisionOption.DivisionId,
			&divisionOption.Name,
		); err != nil {
			return divisionOptions, err
		}
		divisionOptions = append(divisionOptions, divisionOption)
	}
	return divisionOptions, nil
}

type (
	Division            = generated.Division
	DivisionDetails     = generated.DivisionDetails
	DivisionWithBalance = generated.DivisionWithBalance
	DivisionOption      = generated.DivisionOption
)
