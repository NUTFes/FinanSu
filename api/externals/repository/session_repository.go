package repository

import (
	"context"
	"database/sql"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	goqu "github.com/doug-martin/goqu/v9"
)

type sessionRepository struct {
	client db.Client
}

type SessionRepository interface {
	Create(context.Context, string, string, string) error
	CreateWithTx(context.Context, *sql.Tx, string, string, string) error
	Destroy(context.Context, string) error
	FindSessionByAccessToken(context.Context, string) *sql.Row
	DestroyByUserID(context.Context, string) error
}

func NewSessionRepository(client db.Client) SessionRepository {
	return &sessionRepository{client}
}

// 作成
func (r *sessionRepository) Create(c context.Context, authID string, userID string, accessToken string) error {
	query, args, err := dialect.Insert("session").
		Prepared(true).
		Rows(goqu.Record{
			"auth_id":      authID,
			"user_id":      userID,
			"access_token": accessToken,
		}).
		ToSQL()
	if err != nil {
		return err
	}

	_, err = r.client.DB().ExecContext(c, query, args...)
	if err != nil {
		return err
	}
	return nil
}

func (r *sessionRepository) CreateWithTx(c context.Context, tx *sql.Tx, authID string, userID string, accessToken string) error {
	query, args, err := dialect.Insert("session").
		Prepared(true).
		Rows(goqu.Record{
			"auth_id":      authID,
			"user_id":      userID,
			"access_token": accessToken,
		}).
		ToSQL()
	if err != nil {
		return err
	}

	_, err = tx.ExecContext(c, query, args...)
	if err != nil {
		return err
	}
	return nil
}

// 削除
func (r *sessionRepository) Destroy(c context.Context, accessToken string) error {
	// access tokenで該当のsessionを削除
	query, args, err := dialect.Delete("session").
		Prepared(true).
		Where(goqu.Ex{"access_token": accessToken}).
		ToSQL()
	if err != nil {
		return err
	}

	_, err = r.client.DB().ExecContext(c, query, args...)
	if err != nil {
		return err
	}
	return nil
}

// アクセストークンからセッションを取得
func (r *sessionRepository) FindSessionByAccessToken(c context.Context, accessToken string) *sql.Row {
	query, args, _ := dialect.From("session").
		Prepared(true).
		Where(goqu.Ex{"access_token": accessToken}).
		ToSQL()
	row := r.client.DB().QueryRowContext(c, query, args...)
	return row
}

// user_idからsessionを削除する
func (r *sessionRepository) DestroyByUserID(c context.Context, userID string) error {
	query, args, err := dialect.Delete("session").
		Prepared(true).
		Where(goqu.Ex{"user_id": userID}).
		ToSQL()
	if err != nil {
		return err
	}

	_, err = r.client.DB().ExecContext(c, query, args...)
	if err != nil {
		return err
	}
	return nil
}
