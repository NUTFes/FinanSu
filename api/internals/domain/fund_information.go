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
	ID           ID        `json:"id"`
	UName        string    `json:"user_name"`
	TName        string    `json:"teacher_name"`
	Position		 string    `json:"teacher_position"`
	DName				 string    `json:"department_name"`
	Room				 string		 `json:"teacher_room"`
	IsBlack			 bool			 `json:"teacher_is_black"`
	TRemark			 string		 `json:"teacher_remark"`
	Price        Price     `json:"price"`
	FRemark			 string		 `json:"fund_information_remark"`
	IsFirstCheck bool      `json:"is_first_check"`
	IsLastCheck  bool      `json:"is_last_check"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}
