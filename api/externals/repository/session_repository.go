package repository

import (
	"context"
	"database/sql"
	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/internals/domain"
)

type sessionRepository struct {
	client db.Client
}

type SessionRepository interface {
	Create(context.Context, string, string, string) error
	Destroy(context.Context, string) error
	FindSessionByAccessToken(context.Context, string) *sql.Row
	FindActiveUserByAccessToken(context.Context, string) (domain.User, error)
	DestroyByUserID(context.Context, string) error
}

func NewSessionRepository(client db.Client) SessionRepository {
	return &sessionRepository{client}
}

// 作成
func (r *sessionRepository) Create(c context.Context, authID string, userID string, accessToken string) error {
	query := "insert into session (auth_id, user_id, access_token) values (?, ?, ?)"
	_, err := r.client.DB().ExecContext(c, query, authID, userID, accessToken)
	if err != nil {
		return err
	}
	return nil
}

// 削除
func (r *sessionRepository) Destroy(c context.Context, accessToken string) error {
	// access tokenで該当のsessionを削除
	query := "delete from session where access_token = ?"
	_, err := r.client.DB().ExecContext(c, query, accessToken)
	if err != nil {
		return err
	}
	return nil
}

// アクセストークンからセッションを取得
func (r *sessionRepository) FindSessionByAccessToken(c context.Context, accessToken string) *sql.Row {
	query := "select * from session where access_token = ?"
	row := r.client.DB().QueryRowContext(c, query, accessToken)
	return row
}

func (r *sessionRepository) FindActiveUserByAccessToken(c context.Context, accessToken string) (domain.User, error) {
	var user domain.User
	err := r.client.DB().QueryRowContext(c, `
		SELECT u.id, u.name, u.bureau_id, u.role_id, u.is_deleted, u.created_at, u.updated_at
		FROM session s
		INNER JOIN users u ON u.id = s.user_id
		WHERE s.access_token = ? AND u.is_deleted = FALSE
		LIMIT 1`, accessToken).Scan(
		&user.ID, &user.Name, &user.BureauID, &user.RoleID, &user.IsDeleted, &user.CreatedAt, &user.UpdatedAt,
	)
	return user, err
}

// user_idからsessionを削除する
func (r *sessionRepository) DestroyByUserID(c context.Context, userID string) error {
	query := "delete from session where user_id = ?"
	_, err := r.client.DB().ExecContext(c, query, userID)
	if err != nil {
		return err
	}
	return nil
}
