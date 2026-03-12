package domain

import "time"

type SponsorshipActivity struct {
	ID                int       `json:"id"`
	YearPeriodsID     int       `json:"yearPeriodsId"`
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
	ID                    int          `json:"id"`
	SponsorshipActivityID int          `json:"-"`
	SponsorStyleID        int          `json:"sponsorStyleId"`
	Category              string       `json:"category"`
	Style                 SponsorStyle `json:"style"`
}
