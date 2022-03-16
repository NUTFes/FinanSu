package domain

import("time")

type Sponsor struct {
	ID             ID             `json:"id"`
	Name           Name           `json:"name"`
	Tel            Tel            `json:"tel"`
	Email          Email          `json:"email"`
	Address        Address        `json:"address"`
	Representative Representative `json:"representative"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
}