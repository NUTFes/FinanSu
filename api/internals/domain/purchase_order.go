package domain

import (
	"time"
)

type PurchaseOrder struct {
	ID           ID        `json:"id"`
	DeadLine     DeadLine  `json:"deadline"`
	UserID       ID        `json:"userID"`
	FinanceCheck bool      `json:"financeCheck"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}

type OrderWithItemAndUser struct {
	PurchaseOrder PurchaseOrder  `json:"purchaseOrder"`
	User          User           `json:"user"`
	PurchaseItem  []PurchaseItem `json:"purchaseItem"`
}
