package usecase

import (
	"context"
	"fmt"
	"log"

	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/generated"
	"github.com/NUTFes/FinanSu/api/internals/domain"
)

type festivalItemUseCase struct {
	fRep rep.FestivalItemRepository
	tRep rep.TransactionRepository
}

type FestivalItemUseCase interface {
	GetFestivalItems(context.Context, string, string) (FestivalItemDetails, error)
	GetFestivalItemsForMypage(context.Context, string, string) ([]FestivalItemDetailsForMypage, error)
	GetFestivalItemOptions(context.Context, string, string) ([]FestivalItemOption, error)
	GetFestivalItem(context.Context, string) (FestivalItem, error)
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

func NewFestivalItemUseCase(fRep rep.FestivalItemRepository, tRep rep.TransactionRepository) FestivalItemUseCase {
	return &festivalItemUseCase{fRep, tRep}
}

func (fiu *festivalItemUseCase) GetFestivalItems(
	c context.Context,
	year string,
	divisionId string,
) (FestivalItemDetails, error) {
	var festivalItemDetails FestivalItemDetails
	var festivalItems []FestivalItemWithBalance

	rows, err := fiu.fRep.AllByPeriodAndDivision(c, year, divisionId)
	if err != nil {
		return festivalItemDetails, err
	}

	defer func() {
		if err := rows.Close(); err != nil {
			log.Println(err)
		}
	}()

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

func (fiu *festivalItemUseCase) GetFestivalItem(c context.Context, id string) (FestivalItem, error) {
	var festivalItem FestivalItem

	row, err := fiu.fRep.GetFestivalItemById(c, id)
	if err != nil {
		return festivalItem, err
	}

	err = row.Scan(
		&festivalItem.Id,
		&festivalItem.Name,
		&festivalItem.DivisionId,
		&festivalItem.Memo,
		&festivalItem.Amount,
	)

	if err != nil {
		return festivalItem, err
	}

	return festivalItem, nil
}

func (fiu *festivalItemUseCase) CreateFestivalItem(
	c context.Context,
	festivalItem FestivalItem,
) (FestivalItemWithBalance, error) {
	latestFestivalItemWithBalance := FestivalItemWithBalance{}

	// トランザクションスタート
	tx, _ := fiu.tRep.StartTransaction(c)

	if err := fiu.fRep.CreateFestivalItem(c, tx, festivalItem); err != nil {
		// エラーが発生時はロールバック
		if err := fiu.tRep.RollBack(c, tx); err != nil {
			return latestFestivalItemWithBalance, err
		}
		return latestFestivalItemWithBalance, err
	}

	if err := fiu.fRep.CreateItemBudget(c, tx, festivalItem); err != nil {
		// エラーが発生時はロールバック
		if err := fiu.tRep.RollBack(c, tx); err != nil {
			return latestFestivalItemWithBalance, err
		}
		return latestFestivalItemWithBalance, err
	}

	// コミットしてトランザクション終了
	if err := fiu.tRep.Commit(c, tx); err != nil {
		return latestFestivalItemWithBalance, err
	}

	row, err := fiu.fRep.FindLatestRecord(c)
	if err != nil {
		return latestFestivalItemWithBalance, err
	}
	err = row.Scan(
		&latestFestivalItemWithBalance.Id,
		&latestFestivalItemWithBalance.Name,
		&latestFestivalItemWithBalance.Memo,
		&latestFestivalItemWithBalance.FinancialRecord,
		&latestFestivalItemWithBalance.Division,
		&latestFestivalItemWithBalance.Budget,
		&latestFestivalItemWithBalance.Expense,
		&latestFestivalItemWithBalance.Balance,
	)
	if err != nil {
		return latestFestivalItemWithBalance, err
	}

	return latestFestivalItemWithBalance, nil
}

func (fiu *festivalItemUseCase) UpdateFestivalItem(
	c context.Context,
	id string,
	festivalItem FestivalItem,
) (FestivalItemWithBalance, error) {
	updateFestivalItemWithBalance := FestivalItemWithBalance{}

	// トランザクションスタート
	tx, _ := fiu.tRep.StartTransaction(c)

	if err := fiu.fRep.UpdateFestivalItem(c, tx, id, festivalItem); err != nil {
		// エラーが発生時はロールバック
		if err := fiu.tRep.RollBack(c, tx); err != nil {
			return updateFestivalItemWithBalance, err
		}
		return updateFestivalItemWithBalance, err
	}

	if err := fiu.fRep.UpdateItemBudget(c, tx, id, festivalItem); err != nil {
		// エラーが発生時はロールバック
		if err := fiu.tRep.RollBack(c, tx); err != nil {
			return updateFestivalItemWithBalance, err
		}
		return updateFestivalItemWithBalance, err
	}

	// コミットしてトランザクション終了
	if err := fiu.tRep.Commit(c, tx); err != nil {
		return updateFestivalItemWithBalance, err
	}

	row, err := fiu.fRep.GetById(c, id)
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
	tx, _ := fiu.tRep.StartTransaction(c)

	// 先に紐づく予算を削除
	err := fiu.fRep.DeleteItemBudget(c, tx, id)
	if err != nil {
		if err := fiu.tRep.RollBack(c, tx); err != nil {
			return err
		}
	}

	// 購入物品を削除
	err = fiu.fRep.DeleteFestivalItem(c, tx, id)
	if err != nil {
		if err = fiu.tRep.RollBack(c, tx); err != nil {
			return err
		}
		return err
	}

	// コミットしてトランザクション終了
	if err = fiu.tRep.Commit(c, tx); err != nil {
		return err
	}

	return nil
}

func (fiu *festivalItemUseCase) GetFestivalItemsForMypage(
	c context.Context,
	year string,
	userId string,
) ([]FestivalItemDetailsForMypage, error) {
	var festivalItemDetailsList []FestivalItemDetailsForMypage

	var festivalItemForMyPageColumns []domain.FestivalItemForMyPageColumn

	rows, err := fiu.fRep.GetDetailsByDivisionId(c, year, userId)
	if err != nil {
		return festivalItemDetailsList, err
	}

	defer func() {
		if err := rows.Close(); err != nil {
			log.Println(err)
		}
	}()

	for rows.Next() {
		var festivalItemForMyPageColumn domain.FestivalItemForMyPageColumn
		err := rows.Scan(
			&festivalItemForMyPageColumn.UserName,
			&festivalItemForMyPageColumn.FinancialRecordName,
			&festivalItemForMyPageColumn.DivisionId,
			&festivalItemForMyPageColumn.DivisionName,
			&festivalItemForMyPageColumn.FestivalItemId,
			&festivalItemForMyPageColumn.FestivalItemName,
			&festivalItemForMyPageColumn.Year,
			&festivalItemForMyPageColumn.BudgetAmount,
			&festivalItemForMyPageColumn.BuyReportId,
			&festivalItemForMyPageColumn.PaidBy,
			&festivalItemForMyPageColumn.ReportAmount,
			&festivalItemForMyPageColumn.ReportDate,
			&festivalItemForMyPageColumn.IsPacked,
			&festivalItemForMyPageColumn.IsSettled,
		)
		if err != nil {
			fmt.Println(err)
			return festivalItemDetailsList, err
		}
		festivalItemForMyPageColumns = append(festivalItemForMyPageColumns, festivalItemForMyPageColumn)
	}

	festivalItemDetailsList = convertColumnToGenerated(festivalItemForMyPageColumns)

	return festivalItemDetailsList, nil
}

func (fiu *festivalItemUseCase) GetFestivalItemOptions(
	c context.Context,
	year string,
	divisionId string,
) ([]FestivalItemOption, error) {
	var festivalItemOptions []FestivalItemOption

	rows, err := fiu.fRep.GetFestivalItemOptions(c, year, divisionId)
	if err != nil {
		return festivalItemOptions, err
	}

	defer func() {
		if err := rows.Close(); err != nil {
			log.Println(err)
		}
	}()

	for rows.Next() {
		var festivalItemOption FestivalItemOption
		err := rows.Scan(
			&festivalItemOption.FestivalItemId,
			&festivalItemOption.Name,
		)
		if err != nil {
			return festivalItemOptions, err
		}
		festivalItemOptions = append(festivalItemOptions, festivalItemOption)
	}

	return festivalItemOptions, nil
}

type FestivalItemDetails = generated.FestivalItemDetails
type FestivalItem = generated.FestivalItem
type FestivalItemWithBalance = generated.FestivalItemWithBalance
type FestivalItemDetailsForMypage = generated.FestivalItemsForMyPage
type FestivalItemWithReport = generated.FestivalItemWithReport
type BuyReport = generated.BuyReportInformation
type FestivalItemOption = generated.FestivalItemOption

func convertColumnToGenerated(festivalItemForMyPageColumns []domain.FestivalItemForMyPageColumn) []FestivalItemDetailsForMypage {
	var festivalItemDetailsList []FestivalItemDetailsForMypage

	// NOTE ColumnsをDetailsListの型に合わせてマッピングする。値が無い場合は初期化する。
	var festivalItemDetailsForMypageMap = make(map[string]FestivalItemDetailsForMypage)
	var festivalItemMaps = make(map[string]map[string]FestivalItemWithReport)

	for _, festivalItemForMyPageColumn := range festivalItemForMyPageColumns {
		festivalItemDetailsForMypage := festivalItemDetailsForMypageMap[festivalItemForMyPageColumn.DivisionName]
		// 局と部門名前定義
		festivalItemDetailsForMypage.DivisionName = &festivalItemForMyPageColumn.DivisionName
		festivalItemDetailsForMypage.FinancialRecordName = &festivalItemForMyPageColumn.FinancialRecordName

		// 予算と支出データ集計
		festivalItemMap, ok := festivalItemMaps[festivalItemForMyPageColumn.DivisionName]
		if !ok {
			festivalItemMap = make(map[string]FestivalItemWithReport)
		}
		festivalItemWithReport := festivalItemMap[festivalItemForMyPageColumn.FestivalItemName]
		festivalItemWithReport.FestivalItemName = &festivalItemForMyPageColumn.FestivalItemName

		// totalがなければ定義
		if festivalItemWithReport.FestivalItemTotal == nil {
			expense, budget, balance := 0, 0, 0
			festivalItemWithReport.FestivalItemTotal = &Total{
				Expense: &expense,
				Budget:  &budget,
				Balance: &balance,
			}
		}

		buyReports := festivalItemWithReport.BuyReports
		if buyReports == nil {
			buyReports = &[]generated.BuyReportInformation{}
		}

		buyReport := BuyReport{
			Id:            &festivalItemForMyPageColumn.BuyReportId,
			BuyReportName: &festivalItemForMyPageColumn.PaidBy,
			Amount:        &festivalItemForMyPageColumn.ReportAmount,
			ReportDate:    &festivalItemForMyPageColumn.ReportDate,
		}

		*festivalItemWithReport.FestivalItemTotal.Budget += festivalItemForMyPageColumn.BudgetAmount
		*festivalItemWithReport.FestivalItemTotal.Expense += festivalItemForMyPageColumn.ReportAmount
		*festivalItemWithReport.FestivalItemTotal.Balance += festivalItemForMyPageColumn.BudgetAmount - festivalItemForMyPageColumn.ReportAmount
		switch {
		case festivalItemForMyPageColumn.IsSettled:
			buyReport.Status = &isSettled
		case festivalItemForMyPageColumn.IsPacked:
			buyReport.Status = &isPacked
		default:
			buyReport.Status = &empty
		}

		// 報告が0以上のみ、buyReportsに追加
		if *buyReport.Amount > 0 {
			*buyReports = append(*buyReports, buyReport)
		}

		festivalItemWithReport.BuyReports = buyReports

		festivalItemMap[festivalItemForMyPageColumn.FestivalItemName] = festivalItemWithReport
		festivalItemMaps[festivalItemForMyPageColumn.DivisionName] = festivalItemMap

		// divisionのtotalがなければ定義
		if festivalItemDetailsForMypage.DivisionTotal == nil {
			expense, budget, balance := 0, 0, 0
			festivalItemDetailsForMypage.DivisionTotal = &Total{
				Expense: &expense,
				Budget:  &budget,
				Balance: &balance,
			}
		}

		festivalItemDetailsForMypageMap[festivalItemForMyPageColumn.DivisionName] = festivalItemDetailsForMypage
	}

	for _, festivalItemDetails := range festivalItemDetailsForMypageMap {
		newFestivalItemDetails := festivalItemDetails
		festivalItems := festivalItemMaps[*festivalItemDetails.DivisionName]
		var festivalItemWithReports []FestivalItemWithReport
		for _, festivalItem := range festivalItems {
			festivalItemWithReports = append(festivalItemWithReports, festivalItem)
			*festivalItemDetails.DivisionTotal.Budget += *festivalItem.FestivalItemTotal.Budget
			*festivalItemDetails.DivisionTotal.Expense += *festivalItem.FestivalItemTotal.Expense
			*festivalItemDetails.DivisionTotal.Balance += *festivalItem.FestivalItemTotal.Balance
		}
		newFestivalItemDetails.FestivalItems = &festivalItemWithReports
		festivalItemDetailsList = append(festivalItemDetailsList, newFestivalItemDetails)
	}
	return festivalItemDetailsList
}

var empty = generated.Empty
var isPacked = generated.N1
var isSettled = generated.N2
