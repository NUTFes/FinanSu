package usecase

import (
	"context"
	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/pkg/errors"
)

type budgetUseCase struct {
	rep rep.BudgetRepository
}

type BudgetUseCase interface {
	GetBudgets(context.Context) ([]domain.Budget, error)
	GetBudgetByID(context.Context, string) (domain.Budget, error)
	CreateBudget(context.Context, string, string, string) error
	UpdateBudget(context.Context, string, string, string, string) error
	DestroyBudget(context.Context, string) error
	//budgetsに紐づくyearとsourceの取得
	GetBudgetWithYearAndSource(context.Context, string) (domain.BudgetYearSource, error)
}

func NewBudgetUseCase(rep rep.BudgetRepository) BudgetUseCase {
	return &budgetUseCase{rep}
}

//budgetsの取得(Gets)
func (b *budgetUseCase) GetBudgets(c context.Context) ([]domain.Budget, error) {

	budget := domain.Budget{}
	var budgets []domain.Budget

	// クエリー実行
	rows, err := b.rep.All(c)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		err := rows.Scan(
			&budget.ID,
			&budget.Price,
			&budget.YearID,
			&budget.SourceID,
			&budget.CreatedAt,
			&budget.UpdatedAt,
		)

		if err != nil {
			return nil, errors.Wrapf(err, "cannot connect SQL")
		}

		budgets = append(budgets, budget)
	}
	return budgets, nil
}

//budgetの取得(Get)
func (b *budgetUseCase) GetBudgetByID(c context.Context, id string) (domain.Budget, error) {
	var budget domain.Budget

	row, err := b.rep.Find(c, id)
	err = row.Scan(
		&budget.ID,
		&budget.Price,
		&budget.YearID,
		&budget.SourceID,
		&budget.CreatedAt,
		&budget.UpdatedAt,
	)

	if err != nil {
		return budget, err
	}

	return budget, nil
}

//budgetの作成(Create)
func (b *budgetUseCase) CreateBudget(c context.Context, price string, yearID string, sourceID string) error {
	err := b.rep.Create(c, price, yearID, sourceID)
	return err
}

//budgetの更新(Update)
func (b *budgetUseCase) UpdateBudget(c context.Context, id string, price string, yearID string, sourceID string) error {
	err := b.rep.Update(c, id, price, yearID, sourceID)
	return err
}

//budgetの削除(Delete)
func (b *budgetUseCase) DestroyBudget(c context.Context, id string) error {
	err := b.rep.Destroy(c, id)
	return err
}

//budgetに紐づくyearとsourceの取得(Get)
func (b *budgetUseCase) GetBudgetWithYearAndSource(c context.Context, id string) (domain.BudgetYearSource, error) {
	var budgetyearsource domain.BudgetYearSource

	row, err := b.rep.FindYearAndSource(c, id)
	err = row.Scan(
		&budgetyearsource.ID,
		&budgetyearsource.Price,	
		&budgetyearsource.Year,	
		&budgetyearsource.Name,	
		&budgetyearsource.CreatedAt,	
		&budgetyearsource.UpdatedAt,	
	)
	if err != nil {
		return budgetyearsource, err
	}
	return budgetyearsource , nil
}