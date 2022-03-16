package repository

import (
	"context"
	"database/sql"
	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/pkg/errors"
)

type teacherRepository struct {
	client db.Client
}

type TeacherRepository interface {
	All(context.Context) (*sql.Rows, error)
	Find(context.Context, string) (*sql.Row, error)
	Create(context.Context, string, string, string, string, string, string) error
	Update(context.Context, string, string, string, string, string, string, string) error
	Destroy(context.Context, string) error
}

func NewTeacherRepository(client db.Client) TeacherRepository {
	return &teacherRepository{client}
}

// 全件取得
func (tr *teacherRepository) All(c context.Context) (*sql.Rows, error) {
	rows, err := tr.client.DB().QueryContext(c, "select * from teachers")
	if err != nil {
		return nil, errors.Wrapf(err, "cannot connect SQL")
	}
	return rows, nil
}

// 1件取得
func (tr *teacherRepository) Find(c context.Context, id string) (*sql.Row, error) {
	row := tr.client.DB().QueryRowContext(c, "select * from teachers where id = "+id)
	return row, nil
}

// 作成
func (tr *teacherRepository) Create(c context.Context, name string, position string, departmentID string, room string, isBlack string, remark string) error {
	_, err := tr.client.DB().ExecContext(c, "insert into teachers (name, position, department_id, room, is_black, remark) values ('"+name+"','"+position+"',"+departmentID+",'"+room+"', "+isBlack+", '"+remark+"')")
	return err
}

// 編集
func (tr *teacherRepository) Update(c context.Context, id string, name string, position string, departmentID string, room string, isBlack string, remark string) error {
	query := "update teachers set name = '" + name + "', position = '" + position + "', department_id = " + departmentID + ", room = '" + room + "', is_black = " + isBlack + ", remark = '" + remark + "' where id = " + id
	_, err := tr.client.DB().ExecContext(c, query)
	return err
}

// 削除
func (tr *teacherRepository) Destroy(c context.Context, id string) error {
	_, err := tr.client.DB().ExecContext(c, "delete from teachers where id = "+id)
	return err
}
