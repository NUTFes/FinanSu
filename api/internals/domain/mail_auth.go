package domain

import (
	"time"
)

type MailAuth struct {
	ID        ID        `json:"id"`
	Email     string    `json:"email"`
	Password  string    `json:"password"`
	UserID    UserID    `json:"userID"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type Token struct {
	AccessToken string `json:"accessToken"`
}

type IsSignIn struct {
	IsSignIn bool `json:"isSignIn"`
}
