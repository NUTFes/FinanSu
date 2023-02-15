package domain

import (
	"time"
)

type Budget struct {
	ID        int       `json:"id"`
	Price     uint       `json:"price"`
	YearID    uint       `json:"yearID"`
	SourceID  uint       `json:"sourceID"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type BudgetDetail struct {
	Budget Budget `json:"budget"`
	Year   Year   `json:"year"`
	Source Source `json:"source"`
}
