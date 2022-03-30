package domain

import (
	"time"
)

type MailAuth struct {
	ID        ID        `json:"id"`
	Email     string    `json:"email"`
	Password  string    `json:"password"`
	UserID    UserID    `json:"user_id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Token struct {
	AccessToken string `json:"access_token"`
}

type IsSignIn struct {
	IsSignIn bool `json:"is_sign_in"`
}
