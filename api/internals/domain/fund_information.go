package domain

import (
	"time"
)

type FundInformation struct {
	ID           int       `json:"id"`
	UserID       int       `json:"userID"`
	TeacherID    int       `json:"teacherID"`
	Price        int       `json:"price"`
	Remark       string    `json:"remark"`
	IsFirstCheck bool      `json:"isFirstCheck"`
	IsLastCheck  bool      `json:"isLastCheck"`
	RecievedAt   string    `json:"recievedAt"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}

type FundInformationDetail struct {
	FundInformation FundInformation `json:"fundInformation"`
	User            User            `json:"user"`
	Teacher         Teacher         `json:"teacher"`
	Department		Department		`json:"department"`
}
