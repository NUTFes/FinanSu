package usecase

import (
	"context"
	"fmt"

	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/generated"
)

type divisionUseCase struct {
	rep rep.DivisionRepository
}

type DivisionUseCase interface {
	GetDivisions(context.Context, string, string) (divisionDetails, error)
	CreateDivision(context.Context, division) (divisionWithBalance, error)
	UpdateDivision(context.Context, string, division) (divisionWithBalance, error)
	DestroyDivision(context.Context, string) error
}

func NewDivisionUseCase(rep rep.DivisionRepository) DivisionUseCase {
	return &divisionUseCase{rep}
}

func (du divisionUseCase) GetDivisions(c context.Context, year string, financialRecordId string) (divisionDetails, error) {
	var details divisionDetails
	var divisions []divisionWithBalance

	rows, err := du.rep.AllByPeriodAndFinancialRecord(c, year, financialRecordId)
	if err != nil {
		return divisionDetails{}, err
	}
	defer rows.Close()

	for rows.Next() {
		var division divisionWithBalance
		err := rows.Scan(
			&division.Id,
			&division.Name,
			&division.FinancialRecord,
			&division.Expense,
			&division.Balance,
			&division.Budget,
		)
		if err != nil {
			return divisionDetails{}, err
		}
		divisions = append(divisions, division)
	}

	details.Divisions = &divisions

	var total total
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

func (du *divisionUseCase) CreateDivision(
	c context.Context,
	division division,
) (divisionWithBalance, error) {
	latestDivisionWithBalance := divisionWithBalance{}

	if err := du.rep.Create(c, division); err != nil {
		return latestDivisionWithBalance, err
	}

	row, err := du.rep.FindLatestRecord(c)
	if err != nil {
		fmt.Println(err)
		return latestDivisionWithBalance, err
	}
	err = row.Scan(
		&latestDivisionWithBalance.Id,
		&latestDivisionWithBalance.Name,
		&latestDivisionWithBalance.FinancialRecord,
		&latestDivisionWithBalance.Expense,
		&latestDivisionWithBalance.Balance,
		&latestDivisionWithBalance.Budget,
	)
	if err != nil {
		return latestDivisionWithBalance, err
	}

	return latestDivisionWithBalance, nil
}

func (du *divisionUseCase) UpdateDivision(
	c context.Context,
	id string,
	division division,
) (divisionWithBalance, error) {
	updatedDivisionWithBalance := divisionWithBalance{}

	if err := du.rep.Update(c, id, division); err != nil {
		return updatedDivisionWithBalance, err
	}

	row, err := du.rep.GetById(c, id)
	if err != nil {
		return updatedDivisionWithBalance, err
	}
	err = row.Scan(
		&updatedDivisionWithBalance.Id,
		&updatedDivisionWithBalance.Name,
		&updatedDivisionWithBalance.FinancialRecord,
		&updatedDivisionWithBalance.Expense,
		&updatedDivisionWithBalance.Balance,
		&updatedDivisionWithBalance.Budget,
	)
	if err != nil {
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

// Note: 型名省略。この中のみで呼ぶために小文字宣言
type (
	division            = generated.Division
	divisionDetails     = generated.DivisionDetails
	divisionWithBalance = generated.DivisionWithBalance
	total               = generated.Total
)
