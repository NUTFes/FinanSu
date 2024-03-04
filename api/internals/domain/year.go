package domain

import (
	"time"
)

type Year struct {
	ID        ID        `json:"id"`
	Year      int       `json:"year"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type YearPeriod struct {
	ID        ID        `json:"id"`
	Year      int       `json:"year"`
	StartedAt time.Time `json:"startedAt"`
	EndedAt   time.Time `json:"endedAt"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

