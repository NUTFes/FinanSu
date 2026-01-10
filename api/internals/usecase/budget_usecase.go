package usecase

import (
	"context"
	"log"

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
	CreateBudget(context.Context, string, string, string) (domain.Budget, error)
	UpdateBudget(context.Context, string, string, string, string) (domain.Budget, error)
	DestroyBudget(context.Context, string) error
	GetBudgetDetailByID(context.Context, string) (domain.BudgetDetail, error)
	GetBudgetDetails(c context.Context) ([]domain.BudgetDetail, error)
	GetBudgetDetailsByPeriod(context.Context, string) ([]domain.BudgetDetail, error)
}

func NewBudgetUseCase(rep rep.BudgetRepository) BudgetUseCase {
	return &budgetUseCase{rep}
}

func (b *budgetUseCase) GetBudgets(c context.Context) ([]domain.Budget, error) {
	budget := domain.Budget{}
	var budgets []domain.Budget

	rows, err := b.rep.All(c)
	if err != nil {
		return nil, err
	}
	defer func() {
		if err := rows.Close(); err != nil {
			log.Println(err)
		}
	}()

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

func (b *budgetUseCase) GetBudgetByID(c context.Context, id string) (domain.Budget, error) {
	var budget domain.Budget

	row, err := b.rep.Find(c, id)
	if err != nil {
		return budget, err
	}

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

func (b *budgetUseCase) CreateBudget(c context.Context, price string, yearID string, sourceID string) (domain.Budget, error) {
	latestBudget := domain.Budget{}

	if err := b.rep.Create(c, price, yearID, sourceID); err != nil {
		return latestBudget, err
	}

	row, err := b.rep.FindLatestRecord(c)
	if err != nil {
		return latestBudget, err
	}

	err = row.Scan(
		&latestBudget.ID,
		&latestBudget.Price,
		&latestBudget.YearID,
		&latestBudget.SourceID,
		&latestBudget.CreatedAt,
		&latestBudget.UpdatedAt,
	)
	if err != nil {
		return latestBudget, err
	}
	return latestBudget, nil
}

func (b *budgetUseCase) UpdateBudget(c context.Context, id string, price string, yearID string, sourceID string) (domain.Budget, error) {
	updatedBudget := domain.Budget{}

	if err := b.rep.Update(c, id, price, yearID, sourceID); err != nil {
		return updatedBudget, err
	}

	row, err := b.rep.Find(c, id)
	if err != nil {
		return updatedBudget, err
	}

	err = row.Scan(
		&updatedBudget.ID,
		&updatedBudget.Price,
		&updatedBudget.YearID,
		&updatedBudget.SourceID,
		&updatedBudget.CreatedAt,
		&updatedBudget.UpdatedAt,
	)
	if err != nil {
		return updatedBudget, err
	}

	return updatedBudget, nil
}

func (b *budgetUseCase) DestroyBudget(c context.Context, id string) error {
	err := b.rep.Destroy(c, id)
	return err
}

// budgetに紐づくyearとsourceの取得(Get)
func (b *budgetUseCase) GetBudgetDetailByID(c context.Context, id string) (domain.BudgetDetail, error) {
	var budgetDetail domain.BudgetDetail

	row, err := b.rep.FindDetailByID(c, id)
	if err != nil {
		return budgetDetail, err
	}

	err = row.Scan(
		&budgetDetail.Budget.ID,
		&budgetDetail.Budget.Price,
		&budgetDetail.Budget.YearID,
		&budgetDetail.Budget.SourceID,
		&budgetDetail.Budget.CreatedAt,
		&budgetDetail.Budget.UpdatedAt,
		&budgetDetail.Year.ID,
		&budgetDetail.Year.Year,
		&budgetDetail.Year.CreatedAt,
		&budgetDetail.Year.UpdatedAt,
		&budgetDetail.Source.ID,
		&budgetDetail.Source.Name,
		&budgetDetail.Source.CreatedAt,
		&budgetDetail.Source.UpdatedAt,
	)
	if err != nil {
		return budgetDetail, err
	}
	return budgetDetail, nil
}

func (b *budgetUseCase) GetBudgetDetails(c context.Context) ([]domain.BudgetDetail, error) {
	budgetDetail := domain.BudgetDetail{}
	var budgetDetails []domain.BudgetDetail

	rows, err := b.rep.FindDetail(c)
	if err != nil {
		return nil, err
	}
	defer func() {
		if err := rows.Close(); err != nil {
			log.Println(err)
		}
	}()

	for rows.Next() {
		err := rows.Scan(
			&budgetDetail.Budget.ID,
			&budgetDetail.Budget.Price,
			&budgetDetail.Budget.YearID,
			&budgetDetail.Budget.SourceID,
			&budgetDetail.Budget.CreatedAt,
			&budgetDetail.Budget.UpdatedAt,
			&budgetDetail.Year.ID,
			&budgetDetail.Year.Year,
			&budgetDetail.Year.CreatedAt,
			&budgetDetail.Year.UpdatedAt,
			&budgetDetail.Source.ID,
			&budgetDetail.Source.Name,
			&budgetDetail.Source.CreatedAt,
			&budgetDetail.Source.UpdatedAt,
		)
		if err != nil {
			return nil, errors.Wrapf(err, "cannot connect SQL")
		}
		budgetDetails = append(budgetDetails, budgetDetail)
	}
	return budgetDetails, nil
}

func (b *budgetUseCase) GetBudgetDetailsByPeriod(c context.Context, year string) ([]domain.BudgetDetail, error) {
	budgetDetail := domain.BudgetDetail{}
	var budgetDetails []domain.BudgetDetail

	rows, err := b.rep.FindDetailsByPeriod(c, year)
	if err != nil {
		return nil, err
	}
	defer func() {
		if err := rows.Close(); err != nil {
			log.Println(err)
		}
	}()

	for rows.Next() {
		err := rows.Scan(
			&budgetDetail.Budget.ID,
			&budgetDetail.Budget.Price,
			&budgetDetail.Budget.YearID,
			&budgetDetail.Budget.SourceID,
			&budgetDetail.Budget.CreatedAt,
			&budgetDetail.Budget.UpdatedAt,
			&budgetDetail.Year.ID,
			&budgetDetail.Year.Year,
			&budgetDetail.Year.CreatedAt,
			&budgetDetail.Year.UpdatedAt,
			&budgetDetail.Source.ID,
			&budgetDetail.Source.Name,
			&budgetDetail.Source.CreatedAt,
			&budgetDetail.Source.UpdatedAt,
		)
		if err != nil {
			return nil, errors.Wrapf(err, "cannot connect SQL")
		}
		budgetDetails = append(budgetDetails, budgetDetail)
	}
	return budgetDetails, nil
}
