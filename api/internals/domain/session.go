package domain

import (
	"time"
)

type Session struct {
	ID          ID
	AuthID      int
	UserID      int
	AccessToken string
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

type SessionResetPassword struct {
	ID          ID
	AuthID      int
	UserID      int
	AccessToken string
	CreatedAt   time.Time
	UpdatedAt   time.Time
}
