package domain

import (
	"time"
)

type ItemBudget struct {
	ID             int       `json:"id"`
	Amount         int       `json:"amount"`
	FestivalItemID int       `json:"festivalItemId"`
	CreatedAt      time.Time `json:"createdAt"`
	UpdatedAt      time.Time `json:"updatedAt"`
}
