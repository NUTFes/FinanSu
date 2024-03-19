package domain

import (
	"time"
)

type Activity struct {
	ID				int			`json:"id"`
	UserID			uint		`json:"userID"`
	IsDone			bool		`json:"isDone"`
	SponsorID		uint		`json:"sponsorID"`
	Feature 		string		`json:"feature"`
	Expense			uint		`json:"expense"`
	Remark			string		`json:"remark"`
	Design			int			`json:"design"`
	Url				string		`json:"url"`
	CreatedAt		time.Time	`json:"createdAt"`
	UpdatedAt		time.Time	`json:"updatedAt"`
}

type ActivityDetail struct {
	Activity			Activity				`json:"sponsorActivity"`
	Sponsor				Sponsor					`json:"sponsor"`
	User				User					`json:"user"`
	ActivityInformation ActivityInformation	`json:"sponsorActivityInformation"`
	StyleDetail			[]StyleDetail			`json:"styleDetail"`
}

type StyleDetail struct {
	ActivityStyle 	ActivityStyle	`json:"activityStyle"`
	SponsorStyle 	SponsorStyle 	`json:"sponsorStyle"`
}
