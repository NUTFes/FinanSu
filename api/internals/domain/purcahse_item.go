package domain

import ("time")

type PurchaseItem struct {
	ID              ID              `json:"id"`
	Item            Item            `json:"item"`
	Price           Price           `json:"price"`
	Quanity         Quanity         `json:"quantity"`
	Detail          Detail          `json:"detail"`
	Url             Url             `json:"url"`
	PurchaseOrderID PurchaseOrderID `json:"purchase_order_id"`
	CreatedAt       time.Time       `json:"created_at"`
	UpdatedAt       time.Time       `json:"updated_at"`
}