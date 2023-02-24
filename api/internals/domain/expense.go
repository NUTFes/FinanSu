package domain

import (
	"time"
)

type Expense struct {
	ID         int       `json:"id"`
	Name       string    `json:"name"`
	TotalPrice int       `json:"totalPrice"`
	YearID     int       `json:"yearID"`
	CreatedAt  time.Time `json:"createdAt"`
	UpdatedAt  time.Time `json:"updatedAt"`
}
