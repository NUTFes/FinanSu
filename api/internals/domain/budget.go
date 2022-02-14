package domain

import (
	"time"
)

type ID int
type Price int
type YearID int
type SourceID int

type Budget struct {
	ID        ID        `json:"id"`
	Price     Price     `json:"price"`
	YearID    YearID    `json:"year_id"`
	SourceID  SourceID  `json:"source_id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
