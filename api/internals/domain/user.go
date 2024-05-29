package domain

import (
	"time"
)

type User struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	BureauID  int       `json:"bureauID"`
	RoleID    int       `json:"roleID"`
	IsDeleted bool		`json:"isDeleted"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type UserDetail struct{
	User		User
	MailAuth	MailAuth
}

type DestroyUserIDs struct {
	DeleteIDs	[]string	`json:"deleteIDs"`
}
