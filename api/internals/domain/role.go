package domain

import ("time")

type Role struct {
	ID			ID			`json:"id"`
	Name		string		`json:"name"`
	CreatedAt	time.Time	`json:"created_at"`
	UpdatedAt	time.Time	`json:"updated_at"`
}	