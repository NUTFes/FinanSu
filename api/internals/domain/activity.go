package domain

import (
	"time"
)

type Activity struct {
	ID             int       `json:"id"`
	SponsorStyleID int       `json:"sponsor_style_id"`
	UserID         int       `json:"user_id"`
	IsDone         bool      `json:"is_done"`
	SponsorID      int       `json:"sponsor_id"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

type ActivityForAdminView struct {
	Activity     Activity     `json:"sponsor_activity"`
	Sponsor      Sponsor      `json:"sponsor"`
	SponsorStyle SponsorStyle `json:"sponsor_style"`
	User         User         `json:"user"`
}
