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
	PurchaseItem  PurchaseItem      `json:"purchaseItem"`
	PurchaseOrder PurchaseOrderInfo `json:"purchaseOrder"`
	User          UserInfo          `json:"user"`
}

type PurchaseOrderInfo struct {
	ID           int    `json:"id"`
	DeadLine     string `json:"deadline"`
	UserID       int    `json:"userID"`
	FinanceCheck bool   `json:"financeCheck"`
}

type UserInfo struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	BureauID int    `json:"bureauID"`
	RoleID   int    `json:"roleID"`
}
