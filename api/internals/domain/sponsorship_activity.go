package domain

import "time"

type SponsorshipActivity struct {
	ID                int       `json:"id"`
	YearPeriodID      int       `json:"yearPeriodId"`
	SponsorID         int       `json:"sponsorId"`
	UserID            int       `json:"userId"`
	ActivityStatus    string    `json:"activityStatus"`
	FeasibilityStatus string    `json:"feasibilityStatus"`
	DesignProgress    string    `json:"designProgress"`
	Remarks           string    `json:"remarks"`
	CreatedAt         time.Time `json:"createdAt"`
	UpdatedAt         time.Time `json:"updatedAt"`

	Sponsor       Sponsor              `json:"sponsor"`
	User          User                 `json:"user"`
	SponsorStyles []SponsorStyleDetail `json:"sponsorStyles"`
}

type SponsorStyleDetail struct {
	ID             int          `json:"id"`
	SponsorStyleID int          `json:"sponsorStyleId"`
	Category       string       `json:"category"`
	Style          SponsorStyle `json:"style"`
}

type SponsorshipActivityParams struct {
	YearPeriodID      *int
	Keyword           *string
	ActivityStatus    *string
	FeasibilityStatus *string
	UserID            *int
	SponsorStyleIDs   []int
	Sort              *string
	Order             *string
}
