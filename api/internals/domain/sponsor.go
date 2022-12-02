package domain

import (
	"time"
)

type Sponsor struct {
	ID             ID             `json:"ID"`
	Name           Name           `json:"name"`
	Tel            Tel            `json:"tel"`
	Email          Email          `json:"email"`
	Address        Address        `json:"address"`
	Representative Representative `json:"representative"`
	CreatedAt      time.Time      `json:"createdAt"`
	UpdatedAt      time.Time      `json:"updatedAt"`
}
