package usecase

import (
	"context"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	rep "github.com/NUTFes/FinanSu/api/internals/usecase/repository"
	"github.com/pkg/errors"
)

type budgetUseCase struct {
	rep rep.BudgetRepository
}

type BudgetUseCase interface {
	GetBudgets(context.Context) ([]domain.Budget, error)
	GetBudgetByID(context.Context, string) (domain.Budget, error)
	CreateBudget(context.Context, string, string, string) error
	UpdateBudget(context.Context, string, string, string, string) error
	DestroyBudget(context.Context, string) error
}

func NewBudgetUsecase(rep rep.BudgetRepository) BudgetUseCase {
	return &budgetUseCase{rep}
}

func (b *budgetUseCase) GetBudgets(c context.Context) ([]domain.Budget, error) {

	budget := domain.Budget{}
	var budgets []domain.Budget

	// クエリー実行
	rows, err := b.rep.All()
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		err := rows.Scan(
			&budget.ID,
			&budget.Price,
			&budget.YearID,
			&budget.SourceID,
			&budget.CreatedAt,
			&budget.UpdatedAt,
		)

		if err != nil {
			return nil, errors.Wrapf(err, "cannot connect SQL")
		}

		budgets = append(budgets, budget)
	}
	return budgets, nil
}

func (b *budgetUseCase) GetBudgetByID(c context.Context, id string) (domain.Budget, error) {
	var budget domain.Budget

	row, err := b.rep.Find(id)
	err = row.Scan(
		&budget.ID,
		&budget.Price,
		&budget.YearID,
		&budget.SourceID,
		&budget.CreatedAt,
		&budget.UpdatedAt,
	)

	if err != nil {
		return budget, err
	}

	return budget, nil
}

func (b *budgetUseCase) CreateBudget(c context.Context, price string, yearID string, sourceID string) error {
	err := b.rep.Create(price, yearID, sourceID)
	return err
}

func (b *budgetUseCase) UpdateBudget(c context.Context, id string, price string, yearID string, sourceID string) error {
	err := b.rep.Update(id, price, yearID, sourceID)
	return err
}

func (b *budgetUseCase) DestroyBudget(c context.Context, id string) error {
	err := b.rep.Destroy(id)
	return err
}
