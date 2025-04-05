package usecase

import (
	"context"
	"fmt"

	"github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/generated"
	"github.com/NUTFes/FinanSu/api/internals/domain"
)

type incomeExpenditureManagementUseCase struct {
	rep repository.IncomeExpenditureManagementRepository
}

type IncomeExpenditureManagementUseCase interface {
	IndexIncomeExpenditureManagements(context.Context, string) (*IncomeExpenditureManagementDetails, error)
	PutIncomeExpenditureManagementCheck(context.Context, string, bool) error
}

func NewIncomeExpenditureManagementUseCase(rep repository.IncomeExpenditureManagementRepository) IncomeExpenditureManagementUseCase {
	return &incomeExpenditureManagementUseCase{rep}
}

func (i *incomeExpenditureManagementUseCase) IndexIncomeExpenditureManagements(ctx context.Context, year string) (*IncomeExpenditureManagementDetails, error) {
	var incomeExpenditureManagementDetails IncomeExpenditureManagementDetails

	rows, err := i.rep.All(ctx, year)
	if err != nil {
		return nil, err
	}
	defer func() {
		if err := rows.Close(); err != nil {
			fmt.Println(err)
		}
	}()

	var IncomeExpenditureManagementColumns []IncomeExpenditureManagementColumn
	for rows.Next() {
		var incomeExpenditureManagement IncomeExpenditureManagementColumn
		if err := rows.Scan(
			&incomeExpenditureManagement.ID,
			&incomeExpenditureManagement.Date,
			&incomeExpenditureManagement.Content,
			&incomeExpenditureManagement.Detail,
			&incomeExpenditureManagement.Amount,
			&incomeExpenditureManagement.LogCategory,
			&incomeExpenditureManagement.ReceiveOption,
			&incomeExpenditureManagement.IsChecked,
		); err != nil {
			return nil, err
		}
		IncomeExpenditureManagementColumns = append(IncomeExpenditureManagementColumns, incomeExpenditureManagement)
	}

	incomeExpenditureManagementDetails.IncomeExpenditureManagements = convertColumnToIncomeExpenditureManagement(IncomeExpenditureManagementColumns)
	if len(incomeExpenditureManagementDetails.IncomeExpenditureManagements) == 0 {
		incomeExpenditureManagementDetails.Total = 0
		return &incomeExpenditureManagementDetails, nil
	}

	incomeExpenditureManagementDetails.Total = incomeExpenditureManagementDetails.IncomeExpenditureManagements[0].CurrentBalance
	return &incomeExpenditureManagementDetails, nil
}

func (i *incomeExpenditureManagementUseCase) PutIncomeExpenditureManagementCheck(ctx context.Context, id string, isChecked bool) error {
	if err := i.rep.UpdateChecked(ctx, id, isChecked); err != nil {
		return err
	}
	return nil
}

// DBから取得したデータを変換
func convertColumnToIncomeExpenditureManagement(
	columns []IncomeExpenditureManagementColumn,
) []IncomeExpenditureManagement {
	var incomeExpenditureManagements []IncomeExpenditureManagement
	for _, column := range columns {
		amount := column.Amount
		if column.LogCategory == LOG_CATEGORY_EXPENDITURE {
			amount *= -1
		}
		receiveOption, ok := ReceiveOptionMap[column.ReceiveOption]
		if !ok {
			receiveOption = ""
		}
		incomeExpenditureManagement := IncomeExpenditureManagement{
			Id:            column.ID,
			Date:          column.Date.Format("2006-01-02"),
			Content:       column.Content,
			Detail:        &column.Detail,
			Amount:        amount,
			ReceiveOption: &receiveOption,
			IsChecked:     column.IsChecked,
		}
		incomeExpenditureManagements = append(incomeExpenditureManagements, incomeExpenditureManagement)
	}

	incomeExpenditureManagements = addIncomeExpenditureManagementsCurrentBalance(incomeExpenditureManagements)
	return incomeExpenditureManagements
}

// 残高を求める関数
func addIncomeExpenditureManagementsCurrentBalance(
	incomeExpenditureManagements []IncomeExpenditureManagement,
) []IncomeExpenditureManagement {
	currentBalance := 0
	for i := len(incomeExpenditureManagements) - 1; i >= 0; i-- {
		currentBalance += incomeExpenditureManagements[i].Amount
		incomeExpenditureManagements[i].CurrentBalance = currentBalance
	}
	return incomeExpenditureManagements
}

type (
	IncomeExpenditureManagementDetails = generated.IncomeExpenditureManagementDetails
	IncomeExpenditureManagement        = generated.IncomeExpenditureManagement
	IncomeExpenditureManagementColumn  = domain.IncomeExpenditureManagementColumn
)

const (
	LOG_CATEGORY_INCOME          = "income"
	LOG_CATEGORY_EXPENDITURE     = "expenditure"
	LOG_CATEGORY_SPONSOR_INCOMES = "transfer"
	RECEIVE_OPTION_TRANSFER      = "transfer"
	RECEIVE_OPTION_HAND          = "hand"
)

var ReceiveOptionMap = map[string]string{
	RECEIVE_OPTION_TRANSFER: "振込",
	RECEIVE_OPTION_HAND:     "手渡し",
}
