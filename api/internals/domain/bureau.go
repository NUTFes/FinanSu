package domain

import (
	"time"
)

type Bureau struct {
	ID 				ID 				`json:"id"`
	Name 			Name			`json:"name"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}