package repositories

import (
	"fmt"
	"github.com/NUTFes/finansu/api/internal/externals/db"

	"time"
)

type Budget struct {
	ID        int       `json:"id"`
	Price     int       `json:"price"`
	YearID    int       `json:"year_id"`
	SourceID  int       `json:"source_id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

const (
	getBudgetQuery = "select * from budgets where id = 1"
)

func GetBudget(id int) (*Budget, error) {
	budget, err := db.GetBudget(getBudgetQuery)
	if err != nil {
		return nil, err
	}

	return budget, nil
}
