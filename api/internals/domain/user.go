package domain

import (
	"time"
)

type User struct {
	ID        ID        `json:"id"`
	Name      string    `json:"name"`
	BureauID  int       `json:"bureauID"`
	RoleID    int       `json:"roleID"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
