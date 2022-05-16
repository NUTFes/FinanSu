package domain

import (
	"time"
)

type User struct {
	ID           ID           `json:"id"`
	Name         string       `json:"name"`
	BureauID     int          `json:"bureau_id"`
	RoleID		   int		      `json:"role_id"`
	CreatedAt    time.Time    `json:"created_at"`
	UpdatedAt    time.Time    `json:"updated_at"`
}