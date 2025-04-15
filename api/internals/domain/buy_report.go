package domain

import (
	"time"
)

type BuyReport struct {
	ID             int       `json:"id"`
	FestivalItemID int       `json:"festivalItemId"`
	Amount         int       `json:"amount"`
	Memo           string    `json:"memo"`
	PaidBy         string    `json:"paidBy"`
	CreatedAt      time.Time `json:"createdAt"`
	UpdatedAt      time.Time `json:"updatedAt"`
}

type BuyReportForIncomeExpenditureManagement struct {
	ID     int `json:"id"`
	YearID int `json:"yearId"`
	Amount int `json:"amount"`
}
