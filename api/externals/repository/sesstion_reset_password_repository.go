package repository

import (
	"context"
	"database/sql"
	"github.com/NUTFes/FinanSu/api/drivers/db"
	"fmt"
)


type sessionResetPasswordRepository struct {
	client db.Client
}

type SessionResetPasswordRepository interface {
	Create(context.Context, string, string, string) error
	Destroy(context.Context, string) error
	FindSessionByAccessToken(context.Context, string) *sql.Row
	DestroyByUserID(context.Context, string) error
}

func NewSessionResetPasswordRepository(client db.Client) SessionResetPasswordRepository {
	return &sessionResetPasswordRepository{client}
}

// 作成
func (r *sessionResetPasswordRepository) Create(c context.Context, authID string, userID string, accessToken string) error {
	query := "insert into session_reset_password (auth_id, user_id, access_token) values (" + authID + ", " + userID + ", '" + accessToken + "')"
	_, err := r.client.DB().ExecContext(c, query)
	if err != nil {
		return err
	}
	fmt.Printf("\x1b[36m%s\n", query)
	return nil
}

// 削除
func (r *sessionResetPasswordRepository) Destroy(c context.Context, accessToken string) error {
	// access tokenで該当のsessionを削除
	query := "delete from session_reset_password where access_token = '" + accessToken + "'"
	_, err := r.client.DB().ExecContext(c, query)
	if err != nil {
		return err
	}
	fmt.Printf("\x1b[36m%s\n", query)
	return nil
}

// アクセストークンからセッションを取得
func (r *sessionResetPasswordRepository) FindSessionByAccessToken(c context.Context, accessToken string) *sql.Row {
	query := "select * from session_reset_password where access_token = '" + accessToken + "'"
	row := r.client.DB().QueryRowContext(c, query)
	fmt.Printf("\x1b[36m%s\n", query)
	return row
}

// user_idからsessionを削除する
func (r *sessionResetPasswordRepository) DestroyByUserID(c context.Context, userID string) error {
	query := "delete from session_reset_password where user_id = " + userID
	_, err := r.client.DB().ExecContext(c, query)
	if err != nil {
		return err
	}
	fmt.Printf("\x1b[36m%s\n", query)
	return nil
}
