package repository

import (
	"context"
	"database/sql"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
)

type passwordResetTokenRepository struct {
	client db.Client
	crud   abstract.Crud
}

type PasswordResetTokenRepository interface {
	All(context.Context) (*sql.Rows, error)
	Find(context.Context, string) (*sql.Row, error)
	FindByToken(context.Context, string) (*sql.Row, error)
	Create(context.Context, string, string) error
	Update(context.Context, string, string, string) error
	Destroy(context.Context, string) error
	FindLatestRecord(context.Context) (*sql.Row, error)
}

func NewPasswordResetTokenRepository(c db.Client, ac abstract.Crud) PasswordResetTokenRepository {
	return &passwordResetTokenRepository{c, ac}
}

// 全件取得
func (pr *passwordResetTokenRepository) All(c context.Context) (*sql.Rows, error) {
	query := "SELECT * FROM password_reset_tokens"
	return pr.crud.Read(c, query)
}

// 1件取得
func (pr *passwordResetTokenRepository) Find(c context.Context, id string) (*sql.Row, error) {
	query := "SELECT * FROM password_reset_tokens WHERE id = " + id
	return pr.crud.ReadByID(c, query)
}

// トークンで1件取得
func (pr *passwordResetTokenRepository) FindByToken(c context.Context, token string) (*sql.Row, error) {
	query := "SELECT * FROM password_reset_tokens WHERE token = '" + token + "'"
	return pr.crud.ReadByID(c, query)
}

// 最新1件取得
func (pr *passwordResetTokenRepository) FindLatestRecord(c context.Context) (*sql.Row, error) {
	query := `
		SELECT
			*
		FROM
			password_reset_tokens
		ORDER BY
			id
		DESC LIMIT 1`
	return pr.crud.ReadByID(c, query)
}

// 作成
func (pr *passwordResetTokenRepository) Create(c context.Context, userID string, token string) error {
	query := "INSERT INTO password_reset_tokens (user_id, token) VALUES (" + userID + ",'" + token + "')"
	return pr.crud.UpdateDB(c, query)
}

// 編集
func (pr *passwordResetTokenRepository) Update(c context.Context, id string, userID string, token string) error {
	query := "UPDATE password_reset_tokens SET user_id = " + userID + ", token = '"+ token +"' WHERE id = " + id
	return pr.crud.UpdateDB(c, query)
}

// 削除
func (pr *passwordResetTokenRepository) Destroy(c context.Context, id string) error {
	query := "DELETE FROM password_reset_tokens WHERE id = " + id
	return pr.crud.UpdateDB(c, query)
}

