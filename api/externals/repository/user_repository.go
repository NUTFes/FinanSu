package repository

import (
	"context"
	"database/sql"

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
	query, args, err := dialect.From("users").
		Prepared(true).
		Where(goqu.Ex{"is_deleted": false}).
		ToSQL()
	if err != nil {
		return nil, err
	}

	return ur.client.DB().QueryContext(c, query, args...)
}

// 1件取得
func (ur *userRepository) Find(c context.Context, id string) (*sql.Row, error) {
	query, args, err := dialect.From("users").
		Prepared(true).
		Where(goqu.Ex{"id": id}).
		ToSQL()
	if err != nil {
		return nil, err
	}

	return ur.client.DB().QueryRowContext(c, query, args...), nil
}

// 複数件取得
func (ur *userRepository) FindByIDs(c context.Context, ids []int) (*sql.Rows, error) {
	ds := dialect.
		From("users").
		Prepared(true).
		Select("users.*").
		Where(goqu.I("users.id").In(ids))

	query, args, err := ds.ToSQL()
	if err != nil {
		return nil, err
	}

	return ur.client.DB().QueryContext(c, query, args...)
}

// 作成
func (ur *userRepository) Create(c context.Context, name string, bureauID string, roleID string) (int64, error) {
	query, args, err := dialect.Insert("users").
		Prepared(true).
		Rows(goqu.Record{
			"name":      name,
			"bureau_id": bureauID,
			"role_id":   roleID,
		}).
		ToSQL()
	if err != nil {
		return 0, err
	}

	result, err := ur.client.DB().ExecContext(c, query, args...)
	if err != nil {
		return 0, err
	}
	return result.LastInsertId()
}

func (ur *userRepository) CreateWithTx(c context.Context, tx *sql.Tx, name string, bureauID string, roleID string) (int64, error) {
	query, args, err := dialect.Insert("users").
		Prepared(true).
		Rows(goqu.Record{
			"name":      name,
			"bureau_id": bureauID,
			"role_id":   roleID,
		}).
		ToSQL()
	if err != nil {
		return 0, err
	}

	result, err := tx.ExecContext(c, query, args...)
	if err != nil {
		return 0, err
	}
	return result.LastInsertId()
}

// 編集
func (ur *userRepository) Update(c context.Context, id string, name string, bureauID string, roleID string) error {
	query, args, err := dialect.Update("users").
		Prepared(true).
		Set(goqu.Record{
			"name":      name,
			"bureau_id": bureauID,
			"role_id":   roleID,
		}).
		Where(goqu.Ex{"id": id}).
		ToSQL()
	if err != nil {
		return err
	}

	_, err = ur.client.DB().ExecContext(c, query, args...)
	return err
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
	userQuery, userArgs, err := dialect.Update("users").
		Prepared(true).
		Set(goqu.Record{"is_deleted": true}).
		Where(goqu.Ex{"id": id}).
		ToSQL()
	if err != nil {
		return err
	}

	_, err = tx.ExecContext(c, userQuery, userArgs...)
	if err != nil {
		return err
	}

	mailAuthQuery, mailAuthArgs, err := dialect.Update("mail_auth").
		Prepared(true).
		Set(goqu.Record{"email": nil}).
		Where(goqu.Ex{"user_id": id}).
		ToSQL()
	if err != nil {
		return err
	}

	_, err = tx.ExecContext(c, mailAuthQuery, mailAuthArgs...)
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

	userQuery, userArgs, err := dialect.Update("users").
		Prepared(true).
		Set(goqu.Record{"is_deleted": true}).
		Where(goqu.I("id").In(ids)).
		ToSQL()
	if err != nil {
		return err
	}

	_, err = tx.ExecContext(c, userQuery, userArgs...)
	if err != nil {
		return err
	}

	mailAuthQuery, mailAuthArgs, err := dialect.Update("mail_auth").
		Prepared(true).
		Set(goqu.Record{"email": nil}).
		Where(goqu.I("user_id").In(ids)).
		ToSQL()
	if err != nil {
		return err
	}

	_, err = tx.ExecContext(c, mailAuthQuery, mailAuthArgs...)

	return err
}

func (ur *userRepository) FindNewRecord(c context.Context) (*sql.Row, error) {
	query, args, err := dialect.From("users").
		Prepared(true).
		Where(goqu.Ex{"is_deleted": false}).
		Order(goqu.I("id").Desc()).
		Limit(1).
		ToSQL()
	if err != nil {
		return nil, err
	}

	return ur.client.DB().QueryRowContext(c, query, args...), nil
}

// 1件取得
func (ur *userRepository) FindByEmail(c context.Context, email string) (*sql.Row, error) {
	query, args, err := dialect.From("users").
		Prepared(true).
		Join(goqu.I("mail_auth"), goqu.On(goqu.I("users.id").Eq(goqu.I("mail_auth.user_id")))).
		Where(
			goqu.Ex{"users.is_deleted": false},
			goqu.Ex{"mail_auth.email": email},
		).
		ToSQL()
	if err != nil {
		return nil, err
	}

	return ur.client.DB().QueryRowContext(c, query, args...), nil
}
