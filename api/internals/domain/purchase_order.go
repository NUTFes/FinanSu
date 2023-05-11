package domain

import (
	"time"
)

type PurchaseOrder struct {
	ID           int       `json:"id"`
	DeadLine     string    `json:"deadline"`
	UserID       int       `json:"userID"`
	ExpenseID    int       `json:"expenseID"`
	SourceID	 int	   `json:"sourceID"`
	FinanceCheck bool      `json:"financeCheck"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}

type OrderDetail struct {
	PurchaseOrder PurchaseOrder  `json:"purchaseOrder"`
	User          User           `json:"user"`
	PurchaseItem  []PurchaseItem `json:"purchaseItem"`
}
