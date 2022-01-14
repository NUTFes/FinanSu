package budget

import (
	"time"
)

// Value object
type ID int
type Price int
type YearID int
type SourceID int

// Budget
type Budget struct {
	ID        ID
	Price     Price
	YearID    YearID
	SourceID  SourceID
	CreatedAt time.Time
	UpdatedAt time.Time
}
