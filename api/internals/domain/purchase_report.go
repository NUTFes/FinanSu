package domain

import (
	"time"
)

type PurchaseReport struct {
	ID              ID              `json:"id"`
	UserID          ID              `json:"userID"`
	Discount        int             `json:"discount"`
	Addition        int             `json:"addition"`
	FinanceCheck    bool            `json:"financeCheck"`
	Remark          string          `json:"remark"`
	PurchaseOrderID PurchaseOrderID `json:"purchaseOrderID"`
	CreatedAt       time.Time       `json:"createdAt"`
	UpdatedAt       time.Time       `json:"updatedAt"`
}

type PurchaseReportWithOrderItem struct {
	PurchaseReport PurchaseReport `json:"purchaseReport"`
	ReportUser     User           `json:"reportUser"`
	PurchaseOrder  PurchaseOrder  `json:"purchaseOrder"`
	OrderUser      User           `json:"orderUser"`
	PurchaseItems  []PurchaseItem `json:"purchaseItems"`
}
