package domain

import (
	"time"
)

type PurchaseReport struct {
	ID              int       `json:"id"`
	UserID          int       `json:"userID"`
	Discount        int       `json:"discount"`
	Addition        int       `json:"addition"`
	FinanceCheck    bool      `json:"financeCheck"`
	PurchaseOrderID int       `json:"purchaseOrderID"`
	ExpenseID       int       `json:"expenseID"`
	Remark          string    `json:"remark"`
	CreatedAt       time.Time `json:"createdAt"`
	UpdatedAt       time.Time `json:"updatedAt"`
}

type PurchaseReportDetails struct {
	PurchaseReport PurchaseReport `json:"purchaseReport"`
	ReportUser     User           `json:"reportUser"`
	PurchaseOrder  PurchaseOrder  `json:"purchaseOrder"`
	OrderUser      User           `json:"orderUser"`
	PurchaseItems  []PurchaseItem `json:"purchaseItems"`
}
