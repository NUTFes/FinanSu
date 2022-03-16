package domain

import ("time")

type SponsorStyle struct {
	ID         ID        `json:"id"`
	Scale      Scale     `json:"scale"`
	IsColor    bool   	 `json:"is_color"`
	Price      Price     `json:"price"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}