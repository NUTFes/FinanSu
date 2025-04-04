package usecase

import (
	"context"
	"fmt"

	"github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/generated"
)

type incomeExpenditureManagementUseCase struct {
	rep repository.IncomeExpenditureManagementRepository
}

type IncomeExpenditureManagementUseCase interface {
	IndexIncomeExpenditureManagements(context.Context) (*incomeExpenditureManagements, error)
}

func NewIncomeExpenditureManagementUseCase(rep repository.IncomeExpenditureManagementRepository) IncomeExpenditureManagementUseCase {
	return &incomeExpenditureManagementUseCase{rep}
}

func (i *incomeExpenditureManagementUseCase) IndexIncomeExpenditureManagements(ctx context.Context) (*incomeExpenditureManagements, error) {
	incomeExpenditureManagements, err := i.rep.All(ctx)
	if err != nil {
		return nil, err
	}
	defer func() {
		if err := incomeExpenditureManagements.Close(); err != nil {
			fmt.Println(err)
		}
	}()
	fmt.Println("IndexIncomeExpenditureManagements")
	fmt.Println(incomeExpenditureManagements)
	return nil, nil

}

type incomeExpenditureManagements = generated.IncomeExpenditureManagementDetails
