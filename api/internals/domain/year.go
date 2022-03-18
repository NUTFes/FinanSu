package domain

import (
	"time"
)

type Year struct {
	ID        ID        `json:"id"`
	Year      int       `json:"year"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
