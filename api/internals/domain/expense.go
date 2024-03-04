package domain

import (
	"time"
)

type Expense struct {
	ID         int       `json:"id"`
	Name       string    `json:"name"`
	TotalPrice int       `json:"totalPrice"`
	YearID     int       `json:"yearID"`
	CreatedAt  time.Time `json:"createdAt"`
	UpdatedAt  time.Time `json:"updatedAt"`
}

type ExpenseDetails struct {
	Expense         Expense          `json:"expense"`
	PurchaseDetails []PurchaseDetail `json:"purchaseDetails"`
}

type PurchaseDetail struct {
	PurchaseOrder  PurchaseOrder  `json:"purchaseOrder"`
	PurchaseReport PurchaseReport `json:"purchaseReport"`
	PurchaseItems  []PurchaseItem `json:"purchaseItems"`
}

type ExpenseDetailsByperiod struct {
	Expense         Expense          `json:"expense"`
	Year			Year			 `json:"year"`
	PurchaseDetails []PurchaseDetail `json:"purchaseDetails"`
}
