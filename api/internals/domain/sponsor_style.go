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

// フロントからの受信用
type SponsorStyle2 struct {
	ID        int       `json:"id"`
	Scale     string    `json:"scale"`
	IsColor   bool      `json:"isColor"`
	Price     string    `json:"price"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
