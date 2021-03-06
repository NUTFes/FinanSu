package domain

import (
	"time"
)

type FundInformation struct {
	ID           ID        `json:"id"`
	UserID       ID        `json:"user_id"`
	TeacherID    ID        `json:"teacher_id"`
	Price        Price     `json:"price"`
	Remark       string    `json:"remark"`
	IsFirstCheck bool      `json:"is_first_check"`
	IsLastCheck  bool      `json:"is_last_check"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type FundInforWithUserAndTeacher struct {
	FundInformation FundInformation `json:"fund_information"`
	User            User      `json:"user"`
	Teacher         Teacher   `json:"teacher"`
}