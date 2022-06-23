package domain

import ("time")

type PurchaseItem struct {
	ID              ID              `json:"id"`
	Item            Item            `json:"item"`
	Price           Price           `json:"price"`
	Quantity        Quantity        `json:"quantity"`
	Detail          Detail          `json:"detail"`
	Url             Url             `json:"url"`
	PurchaseOrderID PurchaseOrderID `json:"purchase_order_id"`
	FinanceCheck    bool            `json:"finance_check"`
	CreatedAt       time.Time       `json:"created_at"`
	UpdatedAt       time.Time       `json:"updated_at"`
}

type PurchaseItemWithOrder struct {
	ID              ID              `json:"id"`
	Item            string          `json:"item"`
	Price           int             `json:"price"`
	Quantity        int             `json:"quantity"`
	Detail          string          `json:"detail"`
	Url             string          `json:"url"`
	DeadLine        string          `json:"deadline"`
	Name            string          `json:"name"`
	FinanceCheck    bool            `json:"finance_check"`
	CreatedAt       time.Time       `json:"created_at"`
	UpdatedAt       time.Time       `json:"updated_at"`
}
