package repository

import (
	"context"
	"database/sql"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
)

type userRepository struct {
	client   db.Client
	crud abstract.Crud
}

type UserRepository interface {
	All(context.Context) (*sql.Rows, error)
	Find(context.Context, string) (*sql.Row, error)
	Create(context.Context, string, string, string) error
	Update(context.Context, string, string, string, string) error
	Destroy(context.Context, string) error
	FindNewRecord(context.Context) (*sql.Row, error)
}

func NewUserRepository(c db.Client, ac abstract.Crud) UserRepository {
	return &userRepository{c, ac}
}

// 全件取得
func (ur *userRepository) All(c context.Context) (*sql.Rows, error) {
	query := "SELECT * FROM users"
	return ur.crud.Read(c, query)
}

// 1件取得
func (ur *userRepository) Find(c context.Context, id string) (*sql.Row, error) {
	query := "SELECT * FROM users WHERE id = " + id
	return ur.crud.ReadByID(c, query)
}

// 作成
func (ur *userRepository) Create(c context.Context, name string, bureauID string, roleID string) error {
	query := `
		INSERT INTO
			users (name, bureau_id, role_id)
		VALUES ('` + name + "', " + bureauID + ", " + roleID + ")"
	return ur.crud.UpdateDB(c, query)
}

// 編集
func (ur *userRepository) Update(c context.Context, id string, name string, bureauID string, roleID string) error {
	query := `
		UPDATE
			users
		SET
			name = '` + name +
		"', bureau_id = " + bureauID +
		", role_id = " + roleID +
		" WHERE id = " + id
	return ur.crud.UpdateDB(c, query)
}

// 削除
func (ur *userRepository) Destroy(c context.Context, id string) error {
	query := "DELETE FROM users WHERE id = " + id
	return ur.crud.UpdateDB(c, query)
}

func (ur *userRepository) FindNewRecord(c context.Context) (*sql.Row, error) {
	query := "SELECT * FROM users ORDER BY id DESC LIMIT 1"
	return ur.crud.ReadByID(c, query)
}
