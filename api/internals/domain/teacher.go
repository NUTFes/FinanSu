package domain

import (
	"time"
)

type Teacher struct {
	ID           ID           `json:"ID"`
	Name         string       `json:"name"`
	Position     Position     `json:"position"`
	DepartmentID DepartmentID `json:"departmentID"`
	Room         Room         `json:"room"`
	IsBlack      bool         `json:"isBlack"`
	Remark       string       `json:"remark"`
	CreatedAt    time.Time    `json:"createdAt"`
	UpdatedAt    time.Time    `json:"updatedAt"`
}
