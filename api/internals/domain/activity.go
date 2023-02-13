package domain

import (
	"time"
)

type Activity struct {
	ID             int       `json:"id"`
	SponsorStyleID uint      `json:"sponsorStyleID"`
	UserID         uint      `json:"userID"`
	IsDone         bool      `json:"isDone"`
	SponsorID      uint      `json:"sponsorID"`
	CreatedAt      time.Time `json:"createdAt"`
	UpdatedAt      time.Time `json:"updatedAt"`
}

type ActivityDetail struct {
	Activity     Activity     `json:"sponsorActivity"`
	Sponsor      Sponsor      `json:"sponsor"`
	SponsorStyle SponsorStyle `json:"sponsorStyle"`
	User         User         `json:"user"`
}
