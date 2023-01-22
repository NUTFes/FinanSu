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
}

func NewTeacherRepository(c db.Client, ac abstract.Crud) TeacherRepository {
	return &teacherRepository{c, ac}
}

// 全件取得
func (tr *teacherRepository) All(c context.Context) (*sql.Rows, error) {
	query := "select * from teachers"
	return tr.abstract.Read(c, query)
}

// 1件取得
func (tr *teacherRepository) Find(c context.Context, id string) (*sql.Row, error) {
	query := "select * from teachers where id = " + id
	return tr.abstract.ReadByID(c, query)
}

// 作成
func (tr *teacherRepository) Create(c context.Context, name string, position string, departmentID string, room string, isBlack string, remark string) error {
	query := "insert into teachers (name, position, department_id, room, is_black, remark) values ('" + name + "','" + position + "'," + departmentID + ",'" + room + "', " + isBlack + ", '" + remark + "')"
	return tr.abstract.UpdateDB(c, query)
}

// 編集
func (tr *teacherRepository) Update(c context.Context, id string, name string, position string, departmentID string, room string, isBlack string, remark string) error {
	query := "update teachers set name = '" + name + "', position = '" + position + "', department_id = " + departmentID + ", room = '" + room + "', is_black = " + isBlack + ", remark = '" + remark + "' where id = " + id
	return tr.abstract.UpdateDB(c, query)
}

// 削除
func (tr *teacherRepository) Destroy(c context.Context, id string) error {
	query := "delete from teachers where id = " + id
	return tr.abstract.UpdateDB(c, query)
}
