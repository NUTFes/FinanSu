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
	MultiDestroy(context.Context, []string) error
	FindNewRecord(context.Context) (*sql.Row, error)
	FindByEmail(context.Context, string) (*sql.Row, error)
}

func NewUserRepository(c db.Client, ac abstract.Crud) UserRepository {
	return &userRepository{c, ac}
}

// 全件取得
func (ur *userRepository) All(c context.Context) (*sql.Rows, error) {
	query := "SELECT * FROM users WHERE is_deleted IS FALSE"
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
	query := "UPDATE users SET is_deleted = TRUE WHERE id =" + id
	return ur.crud.UpdateDB(c, query)
}

// 削除
func (ur *userRepository) MultiDestroy(c context.Context, ids []string) error {
	query := "UPDATE users SET is_deleted = TRUE WHERE "
	for index, id := range ids {
		query += "id = " +id
		if(index != len(ids)-1){
			query += " OR "
		}

	}
	err:=ur.crud.UpdateDB(c, query)

	return err
}


func (ur *userRepository) FindNewRecord(c context.Context) (*sql.Row, error) {
	query := "SELECT * FROM users WHERE is_deleted IS FALSE ORDER BY id DESC LIMIT 1"
	return ur.crud.ReadByID(c, query)
}

// 1件取得
func (ur *userRepository) FindByEmail(c context.Context, email string) (*sql.Row, error) {
	query := "SELECT * FROM users INNER JOIN mail_auth ON users.id = mail_auth.user_id WHERE is_deleted IS FALSE AND email = '" + email + "'"
	return ur.crud.ReadByID(c, query)
}
