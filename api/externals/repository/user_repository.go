package repository

import (
	"context"
	"database/sql"
	"strconv"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
	goqu "github.com/doug-martin/goqu/v9"
)

type userRepository struct {
	client db.Client
	crud   abstract.Crud
}

type UserRepository interface {
	All(context.Context) (*sql.Rows, error)
	Find(context.Context, string) (*sql.Row, error)
	FindByIDs(context.Context, []int) (*sql.Rows, error)
	Create(context.Context, string, string, string) (int64, error)
	CreateWithTx(context.Context, *sql.Tx, string, string, string) (int64, error)
	Update(context.Context, string, string, string, string) error
	Destroy(context.Context, string) error
	DestroyWithTx(context.Context, *sql.Tx, string) error
	MultiDestroy(context.Context, []int) error
	MultiDestroyWithTx(context.Context, *sql.Tx, []int) error
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

// 複数件取得
func (ur *userRepository) FindByIDs(c context.Context, ids []int) (*sql.Rows, error) {
	ds := dialect.
		From("users").
		Select("users.*").
		Where(goqu.I("users.id").In(ids))

	query, _, err := ds.ToSQL()
	if err != nil {
		return nil, err
	}

	return ur.crud.Read(c, query)
}

// 作成
func (ur *userRepository) Create(c context.Context, name string, bureauID string, roleID string) (int64, error) {
	result, err := ur.client.DB().ExecContext(c, "INSERT INTO users (name, bureau_id, role_id) VALUES (?, ?, ?)", name, bureauID, roleID)
	if err != nil {
		return 0, err
	}
	return result.LastInsertId()
}

func (ur *userRepository) CreateWithTx(c context.Context, tx *sql.Tx, name string, bureauID string, roleID string) (int64, error) {
	result, err := tx.ExecContext(c, "INSERT INTO users (name, bureau_id, role_id) VALUES (?, ?, ?)", name, bureauID, roleID)
	if err != nil {
		return 0, err
	}
	return result.LastInsertId()
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
	tx, err := ur.client.DB().BeginTx(c, nil)
	if err != nil {
		return err
	}
	if err = ur.DestroyWithTx(c, tx, id); err != nil {
		_ = tx.Rollback()
		return err
	}
	return tx.Commit()
}

func (ur *userRepository) DestroyWithTx(c context.Context, tx *sql.Tx, id string) error {
	_, err := tx.ExecContext(c, "UPDATE users SET is_deleted = TRUE WHERE id = ?", id)
	if err != nil {
		return err
	}

	_, err = tx.ExecContext(c, "UPDATE mail_auth SET email = NULL WHERE user_id = ?", id)
	return err
}

// 複数削除
func (ur *userRepository) MultiDestroy(c context.Context, ids []int) error {
	tx, err := ur.client.DB().BeginTx(c, nil)
	if err != nil {
		return err
	}
	if err = ur.MultiDestroyWithTx(c, tx, ids); err != nil {
		_ = tx.Rollback()
		return err
	}
	return tx.Commit()
}

func (ur *userRepository) MultiDestroyWithTx(c context.Context, tx *sql.Tx, ids []int) error {
	if len(ids) == 0 {
		return nil
	}

	query := "UPDATE users SET is_deleted = TRUE WHERE "
	query2 := "UPDATE mail_auth SET email = NULL WHERE "
	for index, id := range ids {
		query += "id = " + strconv.Itoa(id)
		query2 += "user_id = " + strconv.Itoa(id)

		if index != len(ids)-1 {
			query += " OR "
			query2 += " OR "
		}

	}

	_, err := tx.ExecContext(c, query)
	if err != nil {
		return err
	}

	_, err = tx.ExecContext(c, query2)

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
