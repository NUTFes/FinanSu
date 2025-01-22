package domain

import (
	"time"
)

type BuyStatus struct {
	ID          int       `json:"id"`
	BuyReportID int       `json:"buyReportId"`
	IsPacked    bool      `json:"isPacked"`
	IsSettled   bool      `json:"isSettled"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}
