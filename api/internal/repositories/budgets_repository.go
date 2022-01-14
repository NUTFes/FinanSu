package repositories

import (
	"fmt"
	"github.com/NUTFes/finansu/api/internal/entities/budget"
	"github.com/NUTFes/finansu/api/internal/externals/db"
)

// Query
const (
	getBudgetQuery = "select * from budgets where id = 1"
)

// Budgetを1つ取得する
func GetBudgetByID(id budget.ID) (*budget.Budget, error) {
	var query string = getBudgetQuery
	rows, err := db.DB.client.Query(query)
	if err != nil {
		return nil, fmt.Errorf("%w cannot connect SQL", err)
	}
	budget := budget.Budget{}
	err = rows.Scan(&budget.ID, &budget.Price, &budget.YearID, &budget.SourceID, &budget.CreatedAt, &budget.UpdatedAt)
	defer rows.Close()

	return &budget, nil
}
