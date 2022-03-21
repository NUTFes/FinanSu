package repository

import (
	"context"
	"github.com/NUTFes/FinanSu/api/drivers/db"
)

type sessionRepository struct {
	client db.Client
}

type SessionRepository interface {
	Create(context.Context, string, string) error
	Destroy(context.Context, string) error
}

func NewSessionRepository(client db.Client) SessionRepository {
	return &sessionRepository{client}
}

// 作成
func (r *sessionRepository) Create(c context.Context, authID string, accessToken string) error {
	query := "insert into session (auth_id, access_token) values (" + authID + ",'" + accessToken + "')"
	_, err := r.client.DB().ExecContext(c, query)
	if err != nil {
		return err
	}
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
	return nil
}
