package repository

import (
	"context"
	"database/sql"
	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/pkg/errors"
	"fmt"
)

type userRepository struct {
	client db.Client
}

type UserRepository interface {
	All(context.Context) (*sql.Rows, error)
	Find(context.Context, string) (*sql.Row, error)
	Create(context.Context, string, string, string) error
	Update(context.Context, string, string, string, string) error
	Destroy(context.Context, string) error
}

func NewUserRepository(client db.Client) UserRepository {
	return &userRepository{client}
}

// 全件取得
func (ur *userRepository) All(c context.Context) (*sql.Rows, error) {
	query := "select * from users"
	rows, err := ur.client.DB().QueryContext(c,query )
	if err != nil {
		return nil, errors.Wrapf(err, "cannot connect SQL")
	}
	fmt.Printf("\x1b[36m%s\n", query)
	return rows, nil
}

// 1件取得
func (ur *userRepository) Find(c context.Context, id string) (*sql.Row, error) {
	query := "select * from users where id = "+id
	row := ur.client.DB().QueryRowContext(c, query)
	fmt.Printf("\x1b[36m%s\n", query)
	return row, nil
}

// 作成
func (ur *userRepository) Create(c context.Context, name string, departmentID string, roleID string) error {
	query := "insert into users (name, department_id, role_id) values ('"+name+"', "+departmentID+", "+roleID+")"
	_, err := ur.client.DB().ExecContext(c, query)
	fmt.Printf("\x1b[36m%s\n", query)
	return err
}

// 編集
func (ur *userRepository) Update(c context.Context, id string, name string, departmentID string, roleID string) error {
	query := "update users set name = '"+name+"', department_id = "+departmentID+", role_id = "+roleID+" where id = "+id
	_, err := ur.client.DB().ExecContext(c, query)
	fmt.Printf("\x1b[36m%s\n", query)
	return err
}

// 削除
func (ur *userRepository) Destroy(c context.Context, id string) error {
	query := "delete from users where id = "+id
	_, err := ur.client.DB().ExecContext(c, query)
	fmt.Printf("\x1b[36m%s\n", query)
	return err
}
