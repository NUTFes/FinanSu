package domain

import (
	"time"
)

type IncomeExpenditureManagementDetailColumn struct {
	ID            int
	Date          time.Time
	Content       string
	Detail        string
	Amount        int
	LogCategory   string
	ReceiveOption string
	IsChecked     bool
}

type IncomeExpenditureManagementTableColumn struct {
	ID            int
	Amount        int
	LogCategory   string
	YearID        int
	ReceiveOption string
	IsChecked     bool
}
