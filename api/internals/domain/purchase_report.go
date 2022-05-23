package domain

import (
	"time"
)

type PurchaseReport struct {
	ID   				ID 					`json:"id"`
	UserID 				ID 					`json:"user_id"`
	PurchaseOrderID 	PurchaseOrderID 	`json:"purchase_order_id"`
	CreatedAt 			time.Time 			`json:"created_at"`
	UpdatedAt			time.Time 			`json:"updated_at"`
}

type PurchaseReportWithOrderItem struct {
	PurchaseReport		PurchaseReport	`json:"purchasereport"`
	ReportUser			User			`json:"report_user"`
	PurchaseOrder		PurchaseOrder	`json:"purchaseorder"`
	OrderUser			User			`json:"order_user"`
	PurchaseItems		[]PurchaseItems	`json:"purchaseitems"`
}