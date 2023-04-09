package domain

import (
	"time"
)

type Teacher struct {
	ID           int       `json:"id"`
	Name         string    `json:"name"`
	Position     string    `json:"position"`
	DepartmentID int       `json:"departmentID"`
	Room         string    `json:"room"`
	IsBlack      bool      `json:"isBlack"`
	Remark       string    `json:"remark"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}
