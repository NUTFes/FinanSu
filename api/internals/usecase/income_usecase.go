package usecase

import (
	"context"

	"github.com/NUTFes/FinanSu/api/generated"
)

type incomeUseCase struct {
}

type IncomeUseCase interface {
	CreateIncome(context.Context, Income) (*Income, error)
	GetIncome(context.Context, string) (*Income, error)
	UpdateIncome(context.Context, Income) (*Income, error)
	DeleteIncome(context.Context, string) error
}

func NewIncomeUseCase() IncomeUseCase {
	return &incomeUseCase{}
}

func (uc *incomeUseCase) CreateIncome(ctx context.Context, income Income) (*Income, error) {
	return &income, nil
}

func (uc *incomeUseCase) GetIncome(ctx context.Context, incomeID string) (*Income, error) {
	income := &generated.Income{}
	return income, nil
}

func (uc *incomeUseCase) UpdateIncome(ctx context.Context, income Income) (*Income, error) {
	return &income, nil
}

func (uc *incomeUseCase) DeleteIncome(ctx context.Context, incomeID string) error {
	return nil
}

type (
	Income = generated.Income
)
