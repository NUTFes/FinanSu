package domain

import ("time")

type SponsorStyle struct {
	ID         ID        `json:"id"`
	Scale      Scale     `json:"scale"`
	IsColor    bool   	 `json:"isColor"`
	Price      Price     `json:"price"`
	CreatedAt  time.Time `json:"createdAt"`
	UpdatedAt  time.Time `json:"updatedAt"`
}
