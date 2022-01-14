package usecases

import (
	"github.com/NUTFes/finansu/api/internal/entities/budget"
)

type budgetUseCase struct {
}

func NewBudgetUseCase() BudgetUseCase {
	return &budgetUseCase{}
}

func (budgetUseCase budgetUseCase) GetBudgetByID(id budget.ID) (*budget.Budget, error) {
	return &budget.Budget{ID: 1, Price: 1000, YearID: 1, SourceID: 1}, nil
}

type BudgetUseCase interface {
	// GetBudgets() string
	GetBudgetByID(id budget.ID) (*budget.Budget, error)
	// CreateBudget() string
	// UpdateBudget() string
	// DestroyBudget() string
}
