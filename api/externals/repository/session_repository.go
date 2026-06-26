package repository

import (
	"context"
	"database/sql"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	goqu "github.com/doug-martin/goqu/v9"
	"github.com/doug-martin/goqu/v9/exp"
)

type sessionRepository struct {
	client db.Client
}

type SessionRepository interface {
	Create(context.Context, string, string, string) error
	CreateWithTx(context.Context, *sql.Tx, string, string, string) error
	Destroy(context.Context, string) error
	FindSessionByAccessToken(context.Context, string) (*sql.Row, error)
	DestroyByUserID(context.Context, string) error
	DestroyByUserIDWithTx(context.Context, *sql.Tx, string) error
	DestroyByUserIDsWithTx(context.Context, *sql.Tx, []int) error
}

func NewSessionRepository(client db.Client) SessionRepository {
	return &sessionRepository{client}
}

// 作成
func (r *sessionRepository) Create(c context.Context, authID string, userID string, accessToken string) error {
	query, args, err := createSessionQuery(authID, userID, accessToken)
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
	query, args, err := createSessionQuery(authID, userID, accessToken)
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
	query, args, err := deleteSessionQuery(goqu.Ex{"access_token": accessToken})
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
func (r *sessionRepository) FindSessionByAccessToken(c context.Context, accessToken string) (*sql.Row, error) {
	query, args, err := dialect.From("session").
		Prepared(true).
		Where(goqu.Ex{"access_token": accessToken}).
		ToSQL()
	if err != nil {
		return nil, err
	}

	return r.client.DB().QueryRowContext(c, query, args...), nil
}

// user_idからsessionを削除する
func (r *sessionRepository) DestroyByUserID(c context.Context, userID string) error {
	query, args, err := deleteSessionQuery(goqu.Ex{"user_id": userID})
	if err != nil {
		return err
	}

	_, err = r.client.DB().ExecContext(c, query, args...)
	if err != nil {
		return err
	}
	return nil
}

func (r *sessionRepository) DestroyByUserIDWithTx(c context.Context, tx *sql.Tx, userID string) error {
	query, args, err := deleteSessionQuery(goqu.Ex{"user_id": userID})
	if err != nil {
		return err
	}

	_, err = tx.ExecContext(c, query, args...)
	return err
}

func (r *sessionRepository) DestroyByUserIDsWithTx(c context.Context, tx *sql.Tx, userIDs []int) error {
	if len(userIDs) == 0 {
		return nil
	}

	query, args, err := deleteSessionQuery(goqu.I("user_id").In(userIDs))
	if err != nil {
		return err
	}

	_, err = tx.ExecContext(c, query, args...)
	return err
}

func createSessionQuery(authID string, userID string, accessToken string) (string, []any, error) {
	return dialect.Insert("session").
		Prepared(true).
		Rows(goqu.Record{
			"auth_id":      authID,
			"user_id":      userID,
			"access_token": accessToken,
		}).
		ToSQL()
}

func deleteSessionQuery(where ...exp.Expression) (string, []any, error) {
	return dialect.Delete("session").
		Prepared(true).
		Where(where...).
		ToSQL()
}
