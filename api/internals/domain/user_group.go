package domain

import (
	"time"
)

type UserGroup struct {
	ID        int       `json:"id"`
	UserID    int       `json:"userId"`
	GroupID   int       `json:"groupId"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
