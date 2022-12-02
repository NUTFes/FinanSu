package domain

import (
	"time"
)

type PurchaseItem struct {
	ID              ID              `json:"ID"`
	Item            Item            `json:"item"`
	Price           Price           `json:"price"`
	Quantity        Quantity        `json:"quantity"`
	Detail          Detail          `json:"detail"`
	Url             Url             `json:"url"`
	PurchaseOrderID PurchaseOrderID `json:"purchaseOrderID"`
	FinanceCheck    bool            `json:"financeCheck"`
	CreatedAt       time.Time       `json:"createdAt"`
	UpdatedAt       time.Time       `json:"updatedAt"`
}

type PurchaseItemWithOrder struct {
	ID           ID        `json:"ID"`
	Item         string    `json:"item"`
	Price        int       `json:"price"`
	Quantity     int       `json:"quantity"`
	Detail       string    `json:"detail"`
	Url          string    `json:"url"`
	DeadLine     string    `json:"deadline"`
	Name         string    `json:"name"`
	FinanceCheck bool      `json:"financeCheck"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}
