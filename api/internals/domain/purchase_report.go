package domain

import (
	"time"
)

type PurchaseReport struct {
	ID   						ID 	`json:"id"`
	UserID 					ID `json:"user_id"`
	PurchaseOrderID PurchaseOrderID `json:"purchase_order_id"`
	CreatedAt 			time.Time `json:"created_at"`
	UpdatedAt				time.Time `json:"updated_at"`
}

type PurchaseReportWithOrderItem struct {
	ID              ID      	`json:"id"`
	Name            string   	`json:"name"`
	Item            string    `json:"item"`
	Price           int       `json:"price"`
	Quantity        int       `json:"quantity"`
	Detail          string    `json:"detail"`
	Url             string    `json:"url"`
	FinansuCheck    bool      `json:"finasnsu_check"`
	DeadLine        string    `json:"deadline"`
	CreatedAt 			time.Time `json:"created_at"`
	UpdatedAt				time.Time `json:"updated_at"`
}