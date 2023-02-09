package repository

import (
	"context"
	"database/sql"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
)

type teacherRepository struct {
	client   db.Client
	abstract abstract.Crud
}

type TeacherRepository interface {
	All(context.Context) (*sql.Rows, error)
	Find(context.Context, string) (*sql.Row, error)
	Create(context.Context, string, string, string, string, string, string) error
	Update(context.Context, string, string, string, string, string, string, string) error
	Destroy(context.Context, string) error
	FindLatestRecord(c context.Context) (*sql.Row, error)
}

func NewTeacherRepository(c db.Client, ac abstract.Crud) TeacherRepository {
	return &teacherRepository{c, ac}
}

func (t *teacherRepository) All(c context.Context) (*sql.Rows, error) {
	query := "SELECT * FROM teachers"
	return t.abstract.Read(c, query)
}

func (t *teacherRepository) Find(c context.Context, id string) (*sql.Row, error) {
	query := "SELECT * FROM teachers WHERE id = " + id
	return t.abstract.ReadByID(c, query)
}

func (t *teacherRepository) Create(
	c context.Context,
	name string,
	position string,
	departmentID string,
	room string,
	isBlack string,
	remark string) error {
	query := `
	INSERT teachers
		(name, position, department_id, room, is_black, remark)
	VALUES
		(` + name +
		"," + position +
		"," + departmentID +
		"," + room +
		"', " + isBlack +
		"," + remark +
		")"
	return t.abstract.UpdateDB(c, query)
}

func (t *teacherRepository) Update(
	c context.Context,
	id string,
	name string,
	position string,
	departmentID string,
	room string,
	isBlack string,
	remark string) error {
	query := `
	UPDATE teachers
	SET name =` + name +
		", position = " + position +
		", department_id = " + departmentID +
		", room = '" + room +
		", is_black = " + isBlack +
		", remark = '" + remark +
	" WHERE id = " + id
	return t.abstract.UpdateDB(c, query)
}

func (t *teacherRepository) Destroy(c context.Context, id string) error {
	query := "DELETE FROM teachers WHERE id = " + id
	return t.abstract.UpdateDB(c, query)
}

func (t *teacherRepository) FindLatestRecord(c context.Context) (*sql.Row, error) {
	query := "SELECT * FROM teachers ORDER BY id DESC LIMIT 1"
	return t.abstract.ReadByID(c, query)
}
