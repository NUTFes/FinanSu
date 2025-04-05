package domain

import "time"

type IncomeExpenditureManagementColumn struct {
	ID            int
	Date          time.Time
	Content       string
	Detail        string
	Amount        int
	LogCategory   string
	ReceiveOption string
	IsChecked     bool
}
