package domain

import (
	"time"
)

type FinancialRecord struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	YearID    int       `json:"yearId"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
