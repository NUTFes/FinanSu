package domain

import (
	"time"
)

type PasswordResetToken struct {
	ID        ID        `json:"id"`
	UserID    int    	`json:"userID"`
	Token	  string    `json:"token"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

