package usecase

import (
	"fmt"

	"github.com/NUTFes/FinanSu/api/generated"
)

type incomeExpenditureManagementUseCase struct {
}

type IncomeExpenditureManagementUseCase interface {
	IndexIncomeExpenditureManagements() (*incomeExpenditureManagements, error)
}

func NewIncomeExpenditureManagementUseCase() IncomeExpenditureManagementUseCase {
	return &incomeExpenditureManagementUseCase{}
}

func (i *incomeExpenditureManagementUseCase) IndexIncomeExpenditureManagements() (*incomeExpenditureManagements, error) {
	fmt.Println("IndexIncomeExpenditureManagements")
	return nil, nil

}

type incomeExpenditureManagements = generated.IncomeExpenditureManagementDetails
