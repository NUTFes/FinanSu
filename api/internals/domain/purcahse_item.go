package domain

import (
	"time"
)

type PurchaseItem struct {
	ID              int       `json:"id"`
	Item            string    `json:"item"`
	Price           int       `json:"price"`
	Quantity        int       `json:"quantity"`
	Detail          string    `json:"detail"`
	Url             string    `json:"url"`
	PurchaseOrderID int       `json:"purchaseOrderID"`
	FinanceCheck    bool      `json:"financeCheck"`
	CreatedAt       time.Time `json:"createdAt"`
	UpdatedAt       time.Time `json:"updatedAt"`
}

type PurchaseItemDetails struct {
	ID           int       `json:"ID"`
	Item         string    `json:"item"`
	Price        int       `json:"price"`
	Quantity     int       `json:"quantity"`
	Detail       string    `json:"detail"`
	Url          string    `json:"url"`
	DeadLine     string    `json:"deadline"`
	UserName     string    `json:"name"`
	FinanceCheck bool      `json:"financeCheck"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}
