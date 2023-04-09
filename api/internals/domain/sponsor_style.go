package domain

import (
	"time"
)

type SponsorStyle struct {
	ID        int       `json:"id"`
	Scale     string    `json:"scale"`
	IsColor   bool      `json:"isColor"`
	Price     int       `json:"price"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
