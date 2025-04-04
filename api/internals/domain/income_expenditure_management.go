package domain

import "time"

type IncomeExpenditureManagementColumn struct {
	Date        time.Time
	Content     string
	Detail      string
	Amount      int
	LogCategory string
	IsChecked   bool
}
