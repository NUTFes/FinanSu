package repository

import (
	"database/sql"
)

type BudgetRepository interface {
	All() (*sql.Rows, error)
	Find(string) (*sql.Row, error)
	Create(string, string, string) error
	Update(string, string, string) error
	Destroy(string) error
}
