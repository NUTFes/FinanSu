package domain

import (
	"time"
)

type Budget struct {
	ID        ID        `json:"id"`
	Price     Price     `json:"price"`
	YearID    YearID    `json:"yearID"`
	SourceID  SourceID  `json:"sourceID"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type BudgetYearSource struct {
	Budget Budget `json:"budget"`
	Year   Year   `json:"year"`
	Source Source `json:"source"`
}
