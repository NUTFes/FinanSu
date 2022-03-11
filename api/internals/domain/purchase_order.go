package domain

import (
	"time"
)
type PurchaseOrder struct {
	ID       ID        `json:"id"`
	DeadLine DeadLine  `json:"deadline"`
	UserID   ID        `json:"user_id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}