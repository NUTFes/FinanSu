package usecase

import (
	"context"

	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/pkg/errors"
)

type expenseUseCase struct {
	rep rep.ExpenseRepository
}

type ExpenseUseCase interface {
	GetExpenses(context.Context) ([]domain.Expense, error)
	GetExpenseByID(context.Context, string) (domain.Expense, error)
	CreateExpense(context.Context, string, string) (domain.Expense, error)
	UpdateExpense(context.Context, string, string, string) (domain.Expense, error)
	DestroyExpense(context.Context, string) error
	UpdateExpenseTP(context.Context) error
}

func NewExpenseUseCase(rep rep.ExpenseRepository) ExpenseUseCase {
	return &expenseUseCase{rep}
}

func (e *expenseUseCase) GetExpenses(c context.Context) ([]domain.Expense, error) {
	expense := domain.Expense{}
	var expenses []domain.Expense

	// クエリー実行
	rows, err := e.rep.All(c)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		err := rows.Scan(
			&expense.ID,
			&expense.Name,
			&expense.TotalPrice,
			&expense.YearID,
			&expense.CreatedAt,
			&expense.UpdatedAt,
		)

		if err != nil {
			return nil, errors.Wrapf(err, "cannot connect SQL")
		}

		expenses = append(expenses, expense)
	}
	return expenses, nil
}

func (e *expenseUseCase) GetExpenseByID(c context.Context, id string) (domain.Expense, error) {
	expense := domain.Expense{}
	row, err := e.rep.Find(c, id)
	err = row.Scan(
		&expense.ID,
		&expense.Name,
		&expense.TotalPrice,
		&expense.YearID,
		&expense.CreatedAt,
		&expense.UpdatedAt,
	)
	if err != nil {
		return expense, err
	}
	return expense, nil
}

func (e *expenseUseCase) CreateExpense(c context.Context, name string, yearID string) (domain.Expense, error) {
	latastExpense := domain.Expense{}
	err := e.rep.Create(c, name, yearID)
	row, err := e.rep.FindLatestRecord(c)
	err = row.Scan(
		&latastExpense.ID,
		&latastExpense.Name,
		&latastExpense.TotalPrice,
		&latastExpense.YearID,
		&latastExpense.CreatedAt,
		&latastExpense.UpdatedAt,
	)
	if err != nil {
		return latastExpense, err
	}
	return latastExpense, err
}

func (e *expenseUseCase) UpdateExpense(c context.Context, id string, name string, yearID string) (domain.Expense, error) {
	updatedExpense := domain.Expense{}
	err := e.rep.Update(c, id, name, yearID)
	row, err := e.rep.Find(c, id)
	err = row.Scan(
		&updatedExpense.ID,
		&updatedExpense.Name,
		&updatedExpense.TotalPrice,
		&updatedExpense.YearID,
		&updatedExpense.CreatedAt,
		&updatedExpense.UpdatedAt,
	)
	if err != nil {
		return updatedExpense, err
	}
	return updatedExpense, err
}

func (e *expenseUseCase) DestroyExpense(c context.Context, id string) error {
	err := e.rep.Destroy(c, id)
	return err
}

func (e *expenseUseCase) UpdateExpenseTP(c context.Context) error {
	err := e.rep.UpdateTotalprice(c)
	return err
}
