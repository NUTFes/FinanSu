package domain

import (
	"time"
)
type PurchaseOrder struct {
	ID       		 ID        `json:"id"`
	DeadLine 		 DeadLine  `json:"deadline"`
	UserID   		 ID        `json:"user_id"`
	FinanceCheck bool      `json:"finance_check"`
	CreatedAt 	 time.Time `json:"created_at"`
	UpdatedAt 	 time.Time `json:"updated_at"`
}

type OrderWithItemAndUser struct {
	PurchaseOrder PurchaseOrder `json:"purchase_order"`
	User 					User 					`json:"user"`
	PurchaseItem 	[]PurchaseItem 	`json:"purchase_item"`
}