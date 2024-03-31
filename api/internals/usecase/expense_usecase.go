package usecase

import (
	"context"
	"strconv"

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
	GetExpenseDetails(context.Context) ([]domain.ExpenseDetails, error)
	GetExpenseDetailByID(context.Context, string) (domain.ExpenseDetails, error)
	GetExpenseDetailsByPeriod(context.Context, string) ([]domain.ExpenseDetailsByperiod, error)
	GetExpensesByPeriod(context.Context, string) ([]domain.Expense, error)
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

func (e *expenseUseCase) GetExpenseDetails(c context.Context) ([]domain.ExpenseDetails, error) {
	expenseDetail := domain.ExpenseDetails{}
	var expenseDetails []domain.ExpenseDetails
	purchaseDetail := domain.PurchaseDetail{}
	var purchaseDetails []domain.PurchaseDetail
	purchaseItem := domain.PurchaseItem{}
	var purchaseItems []domain.PurchaseItem

	rows, err := e.rep.All(c)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		err := rows.Scan(
			&expenseDetail.Expense.ID,
			&expenseDetail.Expense.Name,
			&expenseDetail.Expense.TotalPrice,
			&expenseDetail.Expense.YearID,
			&expenseDetail.Expense.CreatedAt,
			&expenseDetail.Expense.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		rows, err := e.rep.AllOrderAndReportInfo(c, strconv.Itoa(int(expenseDetail.Expense.ID)))
		for rows.Next() {
			err := rows.Scan(
				&purchaseDetail.PurchaseReport.ID,
				&purchaseDetail.PurchaseReport.UserID,
				&purchaseDetail.PurchaseReport.Discount,
				&purchaseDetail.PurchaseReport.Addition,
				&purchaseDetail.PurchaseReport.FinanceCheck,
				&purchaseDetail.PurchaseReport.PurchaseOrderID,
				&purchaseDetail.PurchaseReport.Remark,
				&purchaseDetail.PurchaseReport.Buyer,
				&purchaseDetail.PurchaseReport.CreatedAt,
				&purchaseDetail.PurchaseReport.UpdatedAt,
				&purchaseDetail.PurchaseOrder.ID,
				&purchaseDetail.PurchaseOrder.DeadLine,
				&purchaseDetail.PurchaseOrder.UserID,
				&purchaseDetail.PurchaseOrder.ExpenseID,
				&purchaseDetail.PurchaseOrder.FinanceCheck,
				&purchaseDetail.PurchaseOrder.CreatedAt,
				&purchaseDetail.PurchaseOrder.UpdatedAt,
			)
			if err != nil {
				return nil, err
			}
			rows, err := e.rep.AllItemInfo(c, strconv.Itoa(int(purchaseDetail.PurchaseOrder.ID)))
			for rows.Next() {
				err := rows.Scan(
					&purchaseItem.ID,
					&purchaseItem.Item,
					&purchaseItem.Price,
					&purchaseItem.Quantity,
					&purchaseItem.Detail,
					&purchaseItem.Url,
					&purchaseItem.PurchaseOrderID,
					&purchaseItem.FinanceCheck,
					&purchaseItem.CreatedAt,
					&purchaseItem.UpdatedAt,
				)
				if err != nil {
					return nil, err
				}
				purchaseItems = append(purchaseItems, purchaseItem)
			}
			purchaseDetail.PurchaseItems = purchaseItems
			purchaseItems = nil
			purchaseDetails = append(purchaseDetails, purchaseDetail)
		}
		expenseDetail.PurchaseDetails = purchaseDetails
		purchaseDetails = nil
		expenseDetails = append(expenseDetails, expenseDetail)
	}
	return expenseDetails, nil
}

func (e *expenseUseCase) GetExpenseDetailByID(c context.Context, id string) (domain.ExpenseDetails, error) {
	expenseDetail := domain.ExpenseDetails{}
	purchaseDetail := domain.PurchaseDetail{}
	var purchaseDetails []domain.PurchaseDetail
	purchaseItem := domain.PurchaseItem{}
	var purchaseItems []domain.PurchaseItem
	row, err := e.rep.Find(c, id)
	err = row.Scan(
		&expenseDetail.Expense.ID,
		&expenseDetail.Expense.Name,
		&expenseDetail.Expense.TotalPrice,
		&expenseDetail.Expense.YearID,
		&expenseDetail.Expense.CreatedAt,
		&expenseDetail.Expense.UpdatedAt,
	)
	if err != nil {
		return expenseDetail, err
	}
	rows, err := e.rep.AllOrderAndReportInfo(c, strconv.Itoa(int(expenseDetail.Expense.ID)))
	for rows.Next() {
		err := rows.Scan(
			&purchaseDetail.PurchaseReport.ID,
			&purchaseDetail.PurchaseReport.UserID,
			&purchaseDetail.PurchaseReport.Discount,
			&purchaseDetail.PurchaseReport.Addition,
			&purchaseDetail.PurchaseReport.FinanceCheck,
			&purchaseDetail.PurchaseReport.PurchaseOrderID,
			&purchaseDetail.PurchaseReport.Remark,
			&purchaseDetail.PurchaseReport.Buyer,
			&purchaseDetail.PurchaseReport.CreatedAt,
			&purchaseDetail.PurchaseReport.UpdatedAt,
			&purchaseDetail.PurchaseOrder.ID,
			&purchaseDetail.PurchaseOrder.DeadLine,
			&purchaseDetail.PurchaseOrder.UserID,
			&purchaseDetail.PurchaseOrder.ExpenseID,
			&purchaseDetail.PurchaseOrder.FinanceCheck,
			&purchaseDetail.PurchaseOrder.CreatedAt,
			&purchaseDetail.PurchaseOrder.UpdatedAt,
		)
		if err != nil {
			return expenseDetail, err
		}
		rows, err := e.rep.AllItemInfo(c, strconv.Itoa(int(purchaseDetail.PurchaseOrder.ID)))
		for rows.Next() {
			err := rows.Scan(
				&purchaseItem.ID,
				&purchaseItem.Item,
				&purchaseItem.Price,
				&purchaseItem.Quantity,
				&purchaseItem.Detail,
				&purchaseItem.Url,
				&purchaseItem.PurchaseOrderID,
				&purchaseItem.FinanceCheck,
				&purchaseItem.CreatedAt,
				&purchaseItem.UpdatedAt,
			)
			if err != nil {
				return expenseDetail, err
			}
			purchaseItems = append(purchaseItems, purchaseItem)
		}
		purchaseDetail.PurchaseItems = purchaseItems
		purchaseItems = nil
		purchaseDetails = append(purchaseDetails, purchaseDetail)
	}
	expenseDetail.PurchaseDetails = purchaseDetails
	return expenseDetail, nil
}

func (e *expenseUseCase) GetExpenseDetailsByPeriod(c context.Context, year string) ([]domain.ExpenseDetailsByperiod, error) {
	expenseDetail := domain.ExpenseDetailsByperiod{}
	var expenseDetails []domain.ExpenseDetailsByperiod
	purchaseDetail := domain.PurchaseDetail{}
	var purchaseDetails []domain.PurchaseDetail
	purchaseItem := domain.PurchaseItem{}
	var purchaseItems []domain.PurchaseItem

	rows, err := e.rep.AllByPeriod(c, year)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		err := rows.Scan(
			&expenseDetail.Expense.ID,
			&expenseDetail.Expense.Name,
			&expenseDetail.Expense.TotalPrice,
			&expenseDetail.Expense.YearID,
			&expenseDetail.Expense.CreatedAt,
			&expenseDetail.Expense.UpdatedAt,
			&expenseDetail.Year.ID,
			&expenseDetail.Year.Year,
			&expenseDetail.Year.CreatedAt,
			&expenseDetail.Year.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		rows, err := e.rep.AllOrderAndReportInfo(c, strconv.Itoa(int(expenseDetail.Expense.ID)))
		for rows.Next() {
			err := rows.Scan(
				&purchaseDetail.PurchaseReport.ID,
				&purchaseDetail.PurchaseReport.UserID,
				&purchaseDetail.PurchaseReport.Discount,
				&purchaseDetail.PurchaseReport.Addition,
				&purchaseDetail.PurchaseReport.FinanceCheck,
				&purchaseDetail.PurchaseReport.PurchaseOrderID,
				&purchaseDetail.PurchaseReport.Remark,
				&purchaseDetail.PurchaseReport.Buyer,
				&purchaseDetail.PurchaseReport.CreatedAt,
				&purchaseDetail.PurchaseReport.UpdatedAt,
				&purchaseDetail.PurchaseOrder.ID,
				&purchaseDetail.PurchaseOrder.DeadLine,
				&purchaseDetail.PurchaseOrder.UserID,
				&purchaseDetail.PurchaseOrder.ExpenseID,
				&purchaseDetail.PurchaseOrder.FinanceCheck,
				&purchaseDetail.PurchaseOrder.CreatedAt,
				&purchaseDetail.PurchaseOrder.UpdatedAt,
			)
			if err != nil {
				return nil, err
			}
			rows, err := e.rep.AllItemInfo(c, strconv.Itoa(int(purchaseDetail.PurchaseOrder.ID)))
			for rows.Next() {
				err := rows.Scan(
					&purchaseItem.ID,
					&purchaseItem.Item,
					&purchaseItem.Price,
					&purchaseItem.Quantity,
					&purchaseItem.Detail,
					&purchaseItem.Url,
					&purchaseItem.PurchaseOrderID,
					&purchaseItem.FinanceCheck,
					&purchaseItem.CreatedAt,
					&purchaseItem.UpdatedAt,
				)
				if err != nil {
					return nil, err
				}
				purchaseItems = append(purchaseItems, purchaseItem)
			}
			purchaseDetail.PurchaseItems = purchaseItems
			purchaseItems = nil
			purchaseDetails = append(purchaseDetails, purchaseDetail)
		}
		expenseDetail.PurchaseDetails = purchaseDetails
		purchaseDetails = nil
		expenseDetails = append(expenseDetails, expenseDetail)
	}
	return expenseDetails, nil
}

func (e *expenseUseCase) GetExpensesByPeriod(c context.Context, year string) ([]domain.Expense, error) {
	ExpenseByperiod := domain.Expense{}
	var expenseByperiods []domain.Expense
	rows, err := e.rep.OnlyExpensesByPeriod(c, year)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
			err := rows.Scan(
					&ExpenseByperiod.ID,
					&ExpenseByperiod.Name,
					&ExpenseByperiod.TotalPrice,
					&ExpenseByperiod.YearID,
					&ExpenseByperiod.CreatedAt,
					&ExpenseByperiod.UpdatedAt,
			)
			if err != nil {
					return nil, err
			}
			expenseByperiods = append(expenseByperiods, ExpenseByperiod)
	}
	if err := rows.Err(); err != nil {
			return nil, err
	}
	return expenseByperiods, nil
}
