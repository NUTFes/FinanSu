package domain

import (
	"time"
)

type Teacher struct {
	ID           ID           `json:"id"`
	Name         string       `json:"name"`
	Position     Position     `json:"position"`
	DepartmentID DepartmentID `json:"department_id"`
	Room         Room         `json:"room"`
	IsBlack      bool         `json:"is_black"`
	Remark       string       `json:"remark"`
	CreatedAt    time.Time    `json:"created_at"`
	UpdatedAt    time.Time    `json:"updated_at"`
}
