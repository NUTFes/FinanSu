package domain

import (
	"time"
)

type Year struct {
	ID        ID        `json:"ID"`
	Year      int       `json:"year"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
