package domain

import (
	"time"
)

type Activity struct {
	ID        			ID        			`json:"id"`
	SuponserStyleID     SuponserStyleID     `json:"suponser_style_id"`
	UserID    			UserID    			`json:"user_id"`
	IsDone				bool  			`json:"is_done"`
	SuponserID			SuponserID			`json:"suponser_id"`
	CreatedAt 			time.Time			`json:"created_at"`
	UpdatedAt 			time.Time			`json:"updated_at"`
}

type ActivityForAdminView struct {
	Activity		Activity		`json:"sponser_activity"`
	Sponsor 		Sponsor			`json:"sponser"`
	SponsorStyle	SponsorStyle	`json:"sponser_style"`
	User			User			`json:"user"`
} 