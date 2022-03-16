package domain

import ("time")

type SponserStyle struct {
	ID         ID        `json:"id"`
	Scale      Scale     `json:"scale"`
	IsColor    bool   	 `json:"is_color"`
	Price      Price     `json:"price"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}