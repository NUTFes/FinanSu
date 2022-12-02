package domain

import (
	"time"
)

type Activity struct {
	ID             ID             `json:"ID"`
	SponsorStyleID SponsorStyleID `json:"sponsorStyleID"`
	UserID         UserID         `json:"userID"`
	IsDone         bool           `json:"isDone"`
	SponsorID      SponsorID      `json:"sponsorID"`
	CreatedAt      time.Time      `json:"createdAt"`
	UpdatedAt      time.Time      `json:"updatedAt"`
}

type ActivityForAdminView struct {
	Activity     Activity     `json:"sponsorActivity"`
	Sponsor      Sponsor      `json:"sponsor"`
	SponsorStyle SponsorStyle `json:"sponsorStyle"`
	User         User         `json:"user"`
}
