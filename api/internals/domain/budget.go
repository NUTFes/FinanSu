package domain

import (
	"time"
)

type ID int
type Price int
type YearID int
type SourceID int

type Budget struct {
	ID        ID
	Price     Price
	YearID    YearID
	SourceID  SourceID
	CreatedAt time.Time
	UpdatedAt time.Time
}
