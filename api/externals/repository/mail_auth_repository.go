package repository

import (
	"context"
	"database/sql"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
	goqu "github.com/doug-martin/goqu/v9"
)

type mailAuthRepository struct {
	client db.Client
	crud   abstract.Crud
}

type MailAuthRepository interface {
	CreateMailAuth(context.Context, string, string, string) (int64, error)
	CreateMailAuthWithTx(context.Context, *sql.Tx, string, string, string) (int64, error)
	FindMailAuthByEmail(context.Context, string) (*sql.Row, error)
	FindMailAuthByID(context.Context, string) (*sql.Row, error)
	ChangePasswordByUserID(context.Context, string, string) error
	InvalidateEmailByUserIDWithTx(context.Context, *sql.Tx, string) error
	InvalidateEmailByUserIDsWithTx(context.Context, *sql.Tx, []int) error
}

func NewMailAuthRepository(client db.Client, crud abstract.Crud) MailAuthRepository {
	return &mailAuthRepository{client, crud}
}

// 作成
func (r *mailAuthRepository) CreateMailAuth(c context.Context, email string, password string, userID string) (int64, error) {
	query, args, err := dialect.Insert("mail_auth").
		Prepared(true).
		Rows(goqu.Record{
			"email":    email,
			"password": password,
			"user_id":  userID,
		}).
		ToSQL()
	if err != nil {
		return 0, err
	}

	result, err := r.client.DB().ExecContext(c, query, args...)
	if err != nil {
		return 0, err
	}
	lastInsertID, err := result.LastInsertId()
	return lastInsertID, err
}

func (r *mailAuthRepository) CreateMailAuthWithTx(c context.Context, tx *sql.Tx, email string, password string, userID string) (int64, error) {
	query, args, err := dialect.Insert("mail_auth").
		Prepared(true).
		Rows(goqu.Record{
			"email":    email,
			"password": password,
			"user_id":  userID,
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

// メールアドレスからmail_authを探してくる
func (r *mailAuthRepository) FindMailAuthByEmail(c context.Context, email string) (*sql.Row, error) {
	query, args, err := dialect.From("mail_auth").
		Prepared(true).
		Where(goqu.Ex{"email": email}).
		ToSQL()
	if err != nil {
		return nil, err
	}

	return r.client.DB().QueryRowContext(c, query, args...), nil
}

// mail_auth_idからmail_authを探してくる
func (r *mailAuthRepository) FindMailAuthByID(c context.Context, id string) (*sql.Row, error) {
	query, args, err := dialect.From("mail_auth").
		Prepared(true).
		Where(goqu.Ex{"id": id}).
		ToSQL()
	if err != nil {
		return nil, err
	}

	return r.client.DB().QueryRowContext(c, query, args...), nil
}

// パスワードの変更
func (r *mailAuthRepository) ChangePasswordByUserID(c context.Context, userID string, password string) error {
	query, args, err := dialect.Update("mail_auth").
		Prepared(true).
		Set(goqu.Record{"password": password}).
		Where(goqu.Ex{"user_id": userID}).
		ToSQL()
	if err != nil {
		return err
	}

	_, err = r.client.DB().ExecContext(c, query, args...)
	return err
}

func (r *mailAuthRepository) InvalidateEmailByUserIDWithTx(c context.Context, tx *sql.Tx, userID string) error {
	query, args, err := dialect.Update("mail_auth").
		Prepared(true).
		Set(goqu.Record{"email": nil}).
		Where(goqu.Ex{"user_id": userID}).
		ToSQL()
	if err != nil {
		return err
	}

	_, err = tx.ExecContext(c, query, args...)
	return err
}

func (r *mailAuthRepository) InvalidateEmailByUserIDsWithTx(c context.Context, tx *sql.Tx, userIDs []int) error {
	if len(userIDs) == 0 {
		return nil
	}

	query, args, err := dialect.Update("mail_auth").
		Prepared(true).
		Set(goqu.Record{"email": nil}).
		Where(goqu.I("user_id").In(userIDs)).
		ToSQL()
	if err != nil {
		return err
	}

	_, err = tx.ExecContext(c, query, args...)
	return err
}
