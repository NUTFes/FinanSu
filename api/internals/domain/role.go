package domain

import (
	"time"
)

type Role struct {
	ID        ID        `json:"ID"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
