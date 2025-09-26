package domain

import (
	"time"
)

type FinancialRecord struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	YearID    int       `json:"yearId"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type FinancialRecordData struct {
	FinancialRecordID   int    `json:"financialRecordId"`
	FinancialRecordName string `json:"financialRecordName"`
	DivisionName        string `json:"divisionName"`
	FestivalItemName    string `json:"festivalItemName"`
	BudgetAmount        int    `json:"budgetAmount"`
	ReportAmount        int    `json:"reportAmount"`
}
