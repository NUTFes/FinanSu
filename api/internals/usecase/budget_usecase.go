package usecase

import (
	rep "github.com/NUTFes/FinanSu/api/externals/repository/budget"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/pkg/errors"
)

func GetBudgets() ([]domain.Budget, error) {

	budget := domain.Budget{}
	var budgets []domain.Budget

	// クエリー実行
	rows, err := rep.All()
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		err := rows.Scan(&budget.ID,
			&budget.Price,
			&budget.YearID,
			&budget.SourceID,
			&budget.CreatedAt,
			&budget.UpdatedAt)

		if err != nil {
			return nil, errors.Wrapf(err, "cannot connect SQL")
		}

		budgets = append(budgets, budget)
	}
	return budgets, nil
}

func GetBudgetByID(id string) (domain.Budget, error) {
	var budget domain.Budget

	row := rep.Find(id)
	err := row.Scan(&budget.ID, &budget.Price, &budget.YearID, &budget.SourceID, &budget.CreatedAt, &budget.UpdatedAt)

	if err != nil {
		return budget, err
	}

	return budget, nil
}

func CreateBudget(price string, yearID string, sourceID string) error {
	err := rep.Create(price, yearID, sourceID)
	return err
}

func UpdateBudget(id string, price string, yearID string, sourceID string) error {
	err := rep.Update(id, price, yearID, sourceID)
	return err
}

func DestroyBudget(id string) error {
	err := rep.Destroy(id)
	return err
}
