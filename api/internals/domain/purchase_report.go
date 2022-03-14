package domain

import (
	"time"
)

type PurchaseReport struct {
	ID   						ID 	`json:"id"`
	Item 						Item `json:"item"`
	Price 					Price `json:"price"`
	UserID 					ID `json:"user_id"`
	PurchaseOrderID PurchaseOrderID `json:"purchase_order_id`
	CreatedAt 			time.Time `json:"created_at"`
	UpdatedAt				time.Time `json:"updated_at"`
}