package domain

import (
	"time"
)

type Division struct {
	ID                int       `json:"id"`
	Name              string    `json:"name"`
	FinancialRecordId int       `json:"financialRecordId"`
	CreatedAt         time.Time `json:"createdAt"`
	UpdatedAt         time.Time `json:"updatedAt"`
}
