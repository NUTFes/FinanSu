package domain

import (
	"time"
)

type Budget struct {
	ID        ID        `json:"id"`
	Price     Price     `json:"price"`
	YearID    YearID    `json:"year_id"`
	SourceID  SourceID  `json:"source_id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type BudgetYearSource struct {
	ID        ID        `json:"id"`
	Price     Price     `json:"price"`
	Year      int       `json:"year"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
