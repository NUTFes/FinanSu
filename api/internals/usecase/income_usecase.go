package usecase

import (
	"context"
	"fmt"
	"strconv"

	"github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/generated"
	"github.com/NUTFes/FinanSu/api/internals/domain"
)

type incomeUseCase struct {
	incomeRepository                      repository.IncomeRepository
	incomeExpenditureManagementRepository repository.IncomeExpenditureManagementRepository
	transactionRepository                 repository.TransactionRepository
}

type IncomeUseCase interface {
	GetAllIncome(context.Context) (*[]IncomeItem, error)
	CreateIncome(context.Context, Income) (*Income, error)
	GetIncome(context.Context, string) (*Income, error)
	UpdateIncome(context.Context, string, Income) (*Income, error)
	DeleteIncome(context.Context, string) error
}

func NewIncomeUseCase(
	incomeRepository repository.IncomeRepository,
	incomeExpenditureManagementRepository repository.IncomeExpenditureManagementRepository,
	transactionRepository repository.TransactionRepository,
) IncomeUseCase {
	return &incomeUseCase{
		incomeRepository:                      incomeRepository,
		incomeExpenditureManagementRepository: incomeExpenditureManagementRepository,
		transactionRepository:                 transactionRepository,
	}
}

var (
	DEFAULT_CHECKED   = false
	SPONSOR_INCOME_ID = 6
)

func (uc *incomeUseCase) GetAllIncome(ctx context.Context) (*[]IncomeItem, error) {
	var incomes []IncomeItem
	// 収入の取得
	rows, err := uc.incomeRepository.All(ctx)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var income IncomeItem
		rows.Scan(
			&income.Id,
			&income.Name,
		)
		incomes = append(incomes, income)
	}
	return &incomes, nil
}

func (uc *incomeUseCase) CreateIncome(ctx context.Context, income Income) (*Income, error) {
	// INCOME_IDが6で企業名が含まれていない場合
	// 企業名が含まれていても、incomeIDが企業協賛でない場合エラーにする
	if income.IncomeId == SPONSOR_INCOME_ID && income.SponsorName == nil || income.IncomeId != SPONSOR_INCOME_ID && income.SponsorName != nil {
		return nil, fmt.Errorf("企業協賛収入の登録が不正です。項目で企業協賛を選択し、企業名を登録してください。")
	}

	// トランザクション開始
	tx, err := uc.transactionRepository.StartTransaction(ctx)
	if err != nil {
		return nil, err
	}

	LogCategory := LOG_CATEGORY_INCOME
	if income.SponsorName != nil {
		LogCategory = LOG_CATEGORY_SPONSOR_INCOMES
	}

	// データ整形
	IncomeExpenditureManagementData := domain.IncomeExpenditureManagementTableColumn{
		Amount:        income.Amount,
		LogCategory:   LogCategory,
		YearID:        income.YearId,
		ReceiveOption: string(*income.ReceiveOption),
		IsChecked:     &DEFAULT_CHECKED,
	}

	// 収支管理の登録
	incomeExpenditureManagementID, err := uc.incomeExpenditureManagementRepository.CreateIncomeExpenditureManagement(ctx, tx, IncomeExpenditureManagementData)
	if err != nil {
		uc.transactionRepository.RollBack(ctx, tx)
		return nil, err
	}

	// 収入項目の登録
	if err = uc.incomeRepository.CreateIncome(ctx, tx, strconv.Itoa(income.IncomeId), strconv.Itoa(*incomeExpenditureManagementID)); err != nil {
		uc.transactionRepository.RollBack(ctx, tx)
		return nil, err
	}

	// 企業名が含まれている場合 && incomeIDが企業協賛の場合、企業名登録
	if income.SponsorName != nil && income.IncomeId == SPONSOR_INCOME_ID {
		if err = uc.incomeRepository.CreateSponsorName(ctx, tx, strconv.Itoa(*incomeExpenditureManagementID), *income.SponsorName); err != nil {
			uc.transactionRepository.RollBack(ctx, tx)
			return nil, err
		}
	}

	// コミット
	if err = uc.transactionRepository.Commit(ctx, tx); err != nil {
		uc.transactionRepository.RollBack(ctx, tx)
		return nil, err
	}
	return &income, nil
}

func (uc *incomeUseCase) GetIncome(ctx context.Context, incomeExpenditureManagementID string) (*Income, error) {
	var income Income
	// 収入の取得
	row, err := uc.incomeExpenditureManagementRepository.GetIncomeExpenditureManagementByID(ctx, incomeExpenditureManagementID)
	if err != nil {
		return nil, err
	}
	row.Scan(
		&income.Id,
		&income.Amount,
		&income.IncomeId,
		&income.YearId,
		&income.ReceiveOption,
		&income.SponsorName,
	)

	return &income, nil
}

func (uc *incomeUseCase) UpdateIncome(ctx context.Context, incomeExpenditureManagementID string, income Income) (*Income, error) {
	// INCOME_IDが6で企業名が含まれていない場合
	// 企業名が含まれていても、incomeIDが企業協賛でない場合エラーにする
	if income.IncomeId == SPONSOR_INCOME_ID && income.SponsorName == nil || income.IncomeId != SPONSOR_INCOME_ID && income.SponsorName != nil {
		return nil, fmt.Errorf("企業協賛収入の登録が不正です。項目で企業協賛を選択し、企業名を登録してください。")
	}

	// トランザクション開始
	tx, err := uc.transactionRepository.StartTransaction(ctx)
	if err != nil {
		return nil, err
	}

	// ログカテゴリの分類
	LogCategory := LOG_CATEGORY_INCOME
	if income.SponsorName != nil {
		LogCategory = LOG_CATEGORY_SPONSOR_INCOMES
	}

	// データ整形
	IncomeExpenditureManagementData := domain.IncomeExpenditureManagementTableColumn{
		Amount:        income.Amount,
		LogCategory:   LogCategory,
		YearID:        income.YearId,
		ReceiveOption: string(*income.ReceiveOption),
	}

	// 収支管理の更新
	if err := uc.incomeExpenditureManagementRepository.UpdatencomeExpenditureManagement(ctx, tx, incomeExpenditureManagementID, IncomeExpenditureManagementData); err != nil {
		uc.transactionRepository.RollBack(ctx, tx)
		return nil, err
	}

	// 収入項目の更新
	if err := uc.incomeRepository.UpdateIncome(ctx, tx, incomeExpenditureManagementID, strconv.Itoa(income.IncomeId)); err != nil {
		uc.transactionRepository.RollBack(ctx, tx)
		return nil, err
	}

	var sponsorName *string
	// 企業名が登録されているか確認
	sponsorNameRow, err := uc.incomeRepository.GetSponsorName(ctx, tx, incomeExpenditureManagementID)
	if err != nil {
		uc.transactionRepository.RollBack(ctx, tx)
		return nil, err
	}
	if err := sponsorNameRow.Scan(&sponsorName); err != nil {
		if err.Error() != "sql: no rows in result set" {
			uc.transactionRepository.RollBack(ctx, tx)
			return nil, err
		}
	}

	// 企業名が含まれている場合 && incomeIDが企業協賛の場合、企業名登録
	if income.SponsorName != nil && income.IncomeId == SPONSOR_INCOME_ID {
		// 企業名が登録されていない場合、企業名登録
		if sponsorName == nil {
			if err := uc.incomeRepository.CreateSponsorName(ctx, tx, incomeExpenditureManagementID, *income.SponsorName); err != nil {
				uc.transactionRepository.RollBack(ctx, tx)
				return nil, err
			}
		} else {
			// 企業名が登録されている場合、企業名更新
			if err := uc.incomeRepository.UpdateSponsorName(ctx, tx, incomeExpenditureManagementID, *income.SponsorName); err != nil {
				uc.transactionRepository.RollBack(ctx, tx)
				return nil, err
			}
		}
	} else if income.SponsorName == nil && income.IncomeId != SPONSOR_INCOME_ID && sponsorName != nil {
		if err := uc.incomeRepository.DeleteSponsorNameByIncomeExpenditureManagementID(ctx, tx, incomeExpenditureManagementID); err != nil {
			uc.transactionRepository.RollBack(ctx, tx)
			return nil, err
		}
	}

	// コミット
	if err := uc.transactionRepository.Commit(ctx, tx); err != nil {
		uc.transactionRepository.RollBack(ctx, tx)
		return nil, err
	}
	return &income, nil
}

func (uc *incomeUseCase) DeleteIncome(ctx context.Context, incomeID string) error {
	return nil
}

type (
	Income     = generated.Income
	IncomeItem = generated.IncomeItem
)
