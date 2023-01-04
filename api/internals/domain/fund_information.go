package domain

import (
	"time"
)

type FundInformation struct {
	ID           ID        `json:"id"`
	UserID       ID        `json:"userID"`
	TeacherID    ID        `json:"teacherID"`
	Price        Price     `json:"price"`
	Remark       string    `json:"remark"`
	IsFirstCheck bool      `json:"isFirstCheck"`
	IsLastCheck  bool      `json:"isLastCheck"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}

type FundInforWithUserAndTeacher struct {
	FundInformation FundInformation `json:"fundInformation"`
	User            User            `json:"user"`
	Teacher         Teacher         `json:"teacher"`
}
