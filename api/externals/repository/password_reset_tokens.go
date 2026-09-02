package repository

import (
	"context"
	"database/sql"
	"os"
	"time"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/drivers/mail"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
)

type passwordResetTokenRepository struct {
	client     db.Client
	crud       abstract.Crud
	mailClient mail.Client
}

type PasswordResetTokenRepository interface {
	All(context.Context) (*sql.Rows, error)
	Find(context.Context, string) (*sql.Row, error)
	FindByToken(context.Context, string) (*sql.Row, error)
	Create(context.Context, string, string) error
	CreateWithTime(context.Context, string, string) error
	Update(context.Context, string, string, string) error
	Destroy(context.Context, string) error
	DestroyByUserID(context.Context, string) error
	FindLatestRecord(context.Context) (*sql.Row, error)
	SendResetEmail(context.Context, string, string, string, string) error
}

func NewPasswordResetTokenRepository(c db.Client, ac abstract.Crud, mc mail.Client) PasswordResetTokenRepository {
	return &passwordResetTokenRepository{c, ac, mc}
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

// 日時を含めて作成
func (pr *passwordResetTokenRepository) CreateWithTime(c context.Context, userID string, token string) error {
	now := time.Now()
	formatTime := now.Format("2006-01-02 15:04:05")

	query := `
			INSERT INTO
				password_reset_tokens (user_id, token, created_at, updated_at)
			VALUES (` + userID + ", '" + token + "', '" + formatTime + "', '" + formatTime + "')"
	return pr.crud.UpdateDB(c, query)
}

// 編集
func (pr *passwordResetTokenRepository) Update(c context.Context, id string, userID string, token string) error {
	query := "UPDATE password_reset_tokens SET user_id = " + userID + ", token = '" + token + "' WHERE id = " + id
	return pr.crud.UpdateDB(c, query)
}

// 削除
func (pr *passwordResetTokenRepository) Destroy(c context.Context, id string) error {
	query := "DELETE FROM password_reset_tokens WHERE id = " + id
	return pr.crud.UpdateDB(c, query)
}

// userIDによるトークンの削除
func (pr *passwordResetTokenRepository) DestroyByUserID(c context.Context, userID string) error {
	query := "DELETE FROM password_reset_tokens WHERE user_id = " + userID
	return pr.crud.UpdateDB(c, query)
}

// リセットメール送信
func (pr *passwordResetTokenRepository) SendResetEmail(c context.Context, id string, name string, email string, token string) error {
	mailSender := os.Getenv("NUTMEG_MAIL_SENDER")
	resetPageUrl := os.Getenv("RESET_PASSWORD_URL") + "/" + id + "/?token=" + token

	html := name + " 様<br><br>" +
		"情報局 FinanSu 担当です。<br><br>" +
		"パスワードの再設定のご依頼を受け付けました。下記の再設定ページにアクセスし、新しいパスワードを設定してください。<br>" +
		"※パスワードリセットの申請に心当たりがない場合は、以降の対応は不要となります。<br><br>" +
		"<a href=\"" + resetPageUrl + "\">" + resetPageUrl + "</a><br><br>" +
		"なお、URLの有効期限は本メールが送信されてから60分間とさせていただきます。<br><br>" +
		"どうぞよろしくお願い申し上げます。<br><br>" +
		"情報局 FinanSu担当<br><br>" +
		"※このメールは送信専用です"

	return pr.mailClient.Send(c, mailSender, []string{email}, "【FinanSu】パスワード再設定メール", html)
}
