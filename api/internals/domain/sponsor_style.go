package domain

import (
	"time"
)

type SponsorStyle struct {
	ID        int       `json:"id"`
	Style     string    `json:"style"`
	Feature   string    `json:"feature"`
	Price     int       `json:"price"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
