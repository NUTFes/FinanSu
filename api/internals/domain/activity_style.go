package domain

import (
	"time"
)

type ActivityStyle struct {
	ID				int			`json:"id"`
	ActivityID		uint		`json:"activityID"`
	SponsoStyleID	uint		`json:"sponsorStyleID"`
	CreatedAt		time.Time	`json:"createdAt"`
	UpdatedAt		time.Time	`json:"updatedAt"`
}
