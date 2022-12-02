package domain

import (
	"time"
)

type Bureau struct {
	ID 				ID 				`json:"ID"`
	Name 			Name			`json:"name"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
