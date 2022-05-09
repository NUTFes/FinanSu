package domain

import (
	"time"
)

type Activity struct {
	ID        			ID        			`json:"id"`
	SponsorStyleID     SponsorStyleID     `json:"sponsor_style_id"`
	UserID    			UserID    			`json:"user_id"`
	IsDone				bool  			`json:"is_done"`
	SponsorID			SponsorID			`json:"sponsor_id"`
	CreatedAt 			time.Time			`json:"created_at"`
	UpdatedAt 			time.Time			`json:"updated_at"`
}

type ActivityForAdminView struct {
	Activity		Activity		`json:"sponsor_activity"`
	Sponsor 		Sponsor			`json:"sponsor"`
	SponsorStyle	SponsorStyle	`json:"sponsor_style"`
	User			User			`json:"user"`
} 