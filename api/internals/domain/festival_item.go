package domain

import (
	"time"
)

type FestivalItem struct {
	ID         int       `json:"id"`
	Name       string    `json:"name"`
	Memo       string    `json:"memo"`
	DivisionID int       `json:"divisionId"`
	CreatedAt  time.Time `json:"createdAt"`
	UpdatedAt  time.Time `json:"updatedAt"`
}
