package repository

import (
	"context"
	"database/sql"
	"github.com/NUTFes/FinanSu/api/drivers/db"
	"fmt"
)


type sessionRepository struct {
	client db.Client
}

type SessionRepository interface {
	Create(context.Context, string, string, string) error
	Destroy(context.Context, string) error
	FindSessionByAccessToken(context.Context, string) *sql.Row
}

func NewSessionRepository(client db.Client) SessionRepository {
	return &sessionRepository{client}
}

// 作成
func (r *sessionRepository) Create(c context.Context, authID string, userID string, accessToken string) error {
	query := "insert into session (auth_id, user_id, access_token) values (" + authID + ", " + userID + ", '" + accessToken + "')"
	_, err := r.client.DB().ExecContext(c, query)
	if err != nil {
		return err
	}
	fmt.Printf("\x1b[36m%s\n", query)
	return nil
}

// 削除
func (r *sessionRepository) Destroy(c context.Context, accessToken string) error {
	// access tokenで該当のsessionを削除
	query := "delete from session where access_token = '" + accessToken + "'"
	_, err := r.client.DB().ExecContext(c, query)
	if err != nil {
		return err
	}
	fmt.Printf("\x1b[36m%s\n", query)
	return nil
}

// アクセストークンからセッションを取得
func (r *sessionRepository) FindSessionByAccessToken(c context.Context, accessToken string) *sql.Row {
	query := "select * from session where access_token = '" + accessToken + "'"
	row := r.client.DB().QueryRowContext(c, query)
	fmt.Printf("\x1b[36m%s\n", query)
	return row
	a
}
