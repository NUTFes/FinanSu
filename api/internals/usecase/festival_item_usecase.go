package usecase

import (
	"context"

	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/generated"
)

type festivalItemUseCase struct {
	rep rep.FestivalItemRepository
}

type FestivalItemUseCase interface {
	GetFestivalItems(context.Context) (FestivalItemDetails, error)
	GetFestivalItemsByYear(context.Context, string) (FestivalItemDetails, error)
	GetFestivalItemsByYearAndDivision(context.Context, string, string) (FestivalItemDetails, error)
	CreateFestivalItem(
		context.Context,
		FestivalItem,
	) (FestivalItemWithBalance, error)
	UpdateFestivalItem(
		context.Context,
		string,
		FestivalItem,
	) (FestivalItemWithBalance, error)
	DestroyFestivalItem(context.Context, string) error
}

func NewFestivalItemUseCase(rep rep.FestivalItemRepository) FestivalItemUseCase {
	return &festivalItemUseCase{rep}
}

func (fiu *festivalItemUseCase) GetFestivalItems(
	c context.Context,
) (FestivalItemDetails, error) {
	var festivalItemDetails FestivalItemDetails
	var festivalItems []FestivalItemWithBalance

	rows, err := fiu.rep.All(c)
	if err != nil {
		return festivalItemDetails, err
	}

	defer rows.Close()
	for rows.Next() {
		var festivalItem FestivalItemWithBalance
		err := rows.Scan(
			&festivalItem.Id,
			&festivalItem.Name,
			&festivalItem.Memo,
			&festivalItem.FinancialRecord,
			&festivalItem.Division,
			&festivalItem.Budget,
			&festivalItem.Expense,
			&festivalItem.Balance,
		)
		if err != nil {
			return festivalItemDetails, err
		}
		festivalItems = append(festivalItems, festivalItem)
	}
	festivalItemDetails.FestivalItems = &festivalItems

	var total Total

	// totalを求める
	budgetTotal := 0
	expenseTotal := 0
	balanceTotal := 0

	for _, festivalItem := range festivalItems {
		budgetTotal += *festivalItem.Budget
		expenseTotal += *festivalItem.Expense
		balanceTotal += *festivalItem.Balance
	}

	total.Budget = &budgetTotal
	total.Expense = &expenseTotal
	total.Balance = &balanceTotal

	festivalItemDetails.Total = &total
	return festivalItemDetails, nil
}

func (fiu *festivalItemUseCase) GetFestivalItemsByYear(
	c context.Context,
	year string,
) (FestivalItemDetails, error) {
	var festivalItemDetails FestivalItemDetails
	var festivalItems []FestivalItemWithBalance

	rows, err := fiu.rep.AllByPeriod(c, year)
	if err != nil {
		return festivalItemDetails, err
	}

	defer rows.Close()
	for rows.Next() {
		var festivalItem FestivalItemWithBalance
		err := rows.Scan(
			&festivalItem.Id,
			&festivalItem.Name,
			&festivalItem.Memo,
			&festivalItem.FinancialRecord,
			&festivalItem.Division,
			&festivalItem.Budget,
			&festivalItem.Expense,
			&festivalItem.Balance,
		)
		if err != nil {
			return festivalItemDetails, err
		}
		festivalItems = append(festivalItems, festivalItem)
	}
	festivalItemDetails.FestivalItems = &festivalItems

	var total Total

	// totalを求める
	budgetTotal := 0
	expenseTotal := 0
	balanceTotal := 0

	for _, festivalItem := range festivalItems {
		budgetTotal += *festivalItem.Budget
		expenseTotal += *festivalItem.Expense
		balanceTotal += *festivalItem.Balance
	}

	total.Budget = &budgetTotal
	total.Expense = &expenseTotal
	total.Balance = &balanceTotal

	festivalItemDetails.Total = &total
	return festivalItemDetails, nil
}

func (fiu *festivalItemUseCase) GetFestivalItemsByYearAndDivision(
	c context.Context,
	year string,
	divisionId string,
) (FestivalItemDetails, error) {
	var festivalItemDetails FestivalItemDetails
	var festivalItems []FestivalItemWithBalance

	rows, err := fiu.rep.AllByPeriodAndDivision(c, year, divisionId)
	if err != nil {
		return festivalItemDetails, err
	}

	defer rows.Close()
	for rows.Next() {
		var festivalItem FestivalItemWithBalance
		err := rows.Scan(
			&festivalItem.Id,
			&festivalItem.Name,
			&festivalItem.Memo,
			&festivalItem.FinancialRecord,
			&festivalItem.Division,
			&festivalItem.Budget,
			&festivalItem.Expense,
			&festivalItem.Balance,
		)
		if err != nil {
			return festivalItemDetails, err
		}
		festivalItems = append(festivalItems, festivalItem)
	}
	festivalItemDetails.FestivalItems = &festivalItems

	var total Total

	// totalを求める
	budgetTotal := 0
	expenseTotal := 0
	balanceTotal := 0

	for _, festivalItem := range festivalItems {
		budgetTotal += *festivalItem.Budget
		expenseTotal += *festivalItem.Expense
		balanceTotal += *festivalItem.Balance
	}

	total.Budget = &budgetTotal
	total.Expense = &expenseTotal
	total.Balance = &balanceTotal

	festivalItemDetails.Total = &total
	return festivalItemDetails, nil
}

func (fiu *festivalItemUseCase) CreateFestivalItem(
	c context.Context,
	festivalItem FestivalItem,
) (FestivalItemWithBalance, error) {
	latastFestivalItemWithBalance := FestivalItemWithBalance{}

	// トランザクションスタート
	tx, _ := fiu.rep.StartTransaction(c)

	if err := fiu.rep.CreateFestivalItem(c, tx, festivalItem); err != nil {
		// エラーが発生時はロールバック
		fiu.rep.RollBack(c, tx)
		return latastFestivalItemWithBalance, err
	}

	if err := fiu.rep.CreateItemBudget(c, tx, festivalItem); err != nil {
		// エラーが発生時はロールバック
		fiu.rep.RollBack(c, tx)
		return latastFestivalItemWithBalance, err
	}

	// コミットしてトランザクション終了
	if err := fiu.rep.Commit(c, tx); err != nil {
		return latastFestivalItemWithBalance, err
	}

	row, err := fiu.rep.FindLatestRecord(c)
	if err != nil {
		return latastFestivalItemWithBalance, err
	}
	err = row.Scan(
		&latastFestivalItemWithBalance.Id,
		&latastFestivalItemWithBalance.Name,
		&latastFestivalItemWithBalance.Memo,
		&latastFestivalItemWithBalance.FinancialRecord,
		&latastFestivalItemWithBalance.Division,
		&latastFestivalItemWithBalance.Budget,
		&latastFestivalItemWithBalance.Expense,
		&latastFestivalItemWithBalance.Balance,
	)
	if err != nil {
		return latastFestivalItemWithBalance, err
	}

	return latastFestivalItemWithBalance, nil
}

func (fiu *festivalItemUseCase) UpdateFestivalItem(
	c context.Context,
	id string,
	festivalItem FestivalItem,
) (FestivalItemWithBalance, error) {
	updateFestivalItemWithBalance := FestivalItemWithBalance{}

	// トランザクションスタート
	tx, _ := fiu.rep.StartTransaction(c)

	if err := fiu.rep.UpdateFestivalItem(c, tx, id, festivalItem); err != nil {
		// エラーが発生時はロールバック
		fiu.rep.RollBack(c, tx)
		return updateFestivalItemWithBalance, err
	}

	if err := fiu.rep.UpdateItemBudget(c, tx, id, festivalItem); err != nil {
		// エラーが発生時はロールバック
		fiu.rep.RollBack(c, tx)
		return updateFestivalItemWithBalance, err
	}

	// コミットしてトランザクション終了
	if err := fiu.rep.Commit(c, tx); err != nil {
		return updateFestivalItemWithBalance, err
	}

	row, err := fiu.rep.GetById(c, id)
	if err != nil {
		return updateFestivalItemWithBalance, err
	}
	err = row.Scan(
		&updateFestivalItemWithBalance.Id,
		&updateFestivalItemWithBalance.Name,
		&updateFestivalItemWithBalance.Memo,
		&updateFestivalItemWithBalance.FinancialRecord,
		&updateFestivalItemWithBalance.Division,
		&updateFestivalItemWithBalance.Budget,
		&updateFestivalItemWithBalance.Expense,
		&updateFestivalItemWithBalance.Balance,
	)
	if err != nil {
		return updateFestivalItemWithBalance, err
	}

	return updateFestivalItemWithBalance, nil
}

func (fiu *festivalItemUseCase) DestroyFestivalItem(c context.Context, id string) error {
	// トランザクションスタート
	tx, _ := fiu.rep.StartTransaction(c)

	// 先に紐づく予算を削除
	err := fiu.rep.DeleteItemBudget(c, tx, id)
	if err != nil {
		fiu.rep.RollBack(c, tx)
	}

	// 購入物品を削除
	err = fiu.rep.DeleteFestivalItem(c, tx, id)
	if err != nil {
		fiu.rep.RollBack(c, tx)
		return err
	}

	// コミットしてトランザクション終了
	if err = fiu.rep.Commit(c, tx); err != nil {
		return err
	}

	return nil
}

type FestivalItemDetails = generated.FestivalItemDetails
type FestivalItem = generated.FestivalItem
type FestivalItemWithBalance = generated.FestivalItemWithBalance
