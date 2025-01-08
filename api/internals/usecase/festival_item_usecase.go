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
	GetFestivalItems(context.Context) (generated.FestivalItemDetails, error)
	GetFestivalItemsByYears(context.Context, string) (generated.FestivalItemDetails, error)
	CreateFestivalItem(
		context.Context,
		generated.FestivalItem,
	) (generated.FestivalItemWithBalance, error)
	UpdateFestivalItem(
		context.Context,
		string,
		generated.FestivalItem,
	) (generated.FestivalItemWithBalance, error)
	DestroyFestivalItem(context.Context, string) error
}

func NewFestivalItemUseCase(rep rep.FestivalItemRepository) FestivalItemUseCase {
	return &festivalItemUseCase{rep}
}

func (fiu *festivalItemUseCase) GetFestivalItems(
	c context.Context,
) (generated.FestivalItemDetails, error) {
	var festivalItemDetails generated.FestivalItemDetails
	return festivalItemDetails, nil
}

func (fiu *festivalItemUseCase) GetFestivalItemsByYears(
	c context.Context,
	year string,
) (generated.FestivalItemDetails, error) {
	var festivalItemDetails generated.FestivalItemDetails
	return festivalItemDetails, nil
}

func (fiu *festivalItemUseCase) CreateFestivalItem(
	c context.Context,
	festivalItem generated.FestivalItem,
) (generated.FestivalItemWithBalance, error) {
	latastFestivalItemWithBalance := generated.FestivalItemWithBalance{}

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
	festivalItem generated.FestivalItem,
) (generated.FestivalItemWithBalance, error) {
	updateFestivalItem := generated.FestivalItemWithBalance{}

	// if err := fiu.rep.Update(c, id, festivalItem); err != nil {
	// 	return updateFestivalItem, err
	// }

	// row, err := fiu.rep.GetById(c, id)
	// if err != nil {
	// 	return updateFestivalItem, err
	// }

	// if err = row.Scan(
	// 	&updateFinancialRecord.Id,
	// 	&updateFinancialRecord.Name,
	// 	&updateFinancialRecord.Year,
	// 	&updateFinancialRecord.Budget,
	// 	&updateFinancialRecord.Expense,
	// 	&updateFinancialRecord.Balance,
	// ); err != nil {
	// 	return updateFinancialRecord, err
	// }

	return updateFestivalItem, nil
}

func (fiu *festivalItemUseCase) DestroyFestivalItem(c context.Context, id string) error {
	err := fiu.rep.DeleteFestivalItem(c, id)
	return err
}
