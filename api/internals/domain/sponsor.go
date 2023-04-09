package domain

import (
	"time"
)

type Sponsor struct {
	ID             int       `json:"id"`
	Name           string    `json:"name"`
	Tel            string    `json:"tel"`
	Email          string    `json:"email"`
	Address        string    `json:"address"`
	Representative string    `json:"representative"`
	CreatedAt      time.Time `json:"createdAt"`
	UpdatedAt      time.Time `json:"updatedAt"`
}
