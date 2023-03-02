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

type ExpenseDetails struct {
	Expense       Expense            `json:"expense"`
	PurchaseItems []PurchaseItemInfo `json:"purchaseItem"`
}

type PurchaseItemInfo struct {
	ID   int    `json:"id"`
	Item string `json:"item"`
}
