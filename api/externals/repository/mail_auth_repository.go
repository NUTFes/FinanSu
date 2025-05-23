package repository

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
)

type mailAuthRepository struct {
	client db.Client
	crud   abstract.Crud
}

type MailAuthRepository interface {
	CreateMailAuth(context.Context, string, string, string) (int64, error)
	FindMailAuthByEmail(context.Context, string) *sql.Row
	FindMailAuthByID(context.Context, string) *sql.Row
	ChangePasswordByUserID(context.Context, string, string) error
}

func NewMailAuthRepository(client db.Client, crud abstract.Crud) MailAuthRepository {
	return &mailAuthRepository{client, crud}
}

// 作成
func (r *mailAuthRepository) CreateMailAuth(c context.Context, email string, password string, userID string) (int64, error) {
	result, err := r.client.DB().ExecContext(c, "insert into mail_auth (email, password, user_id) values ('"+email+"','"+password+"',"+userID+")")
	if err != nil {
		return 0, err
	}
	lastInsertID, err := result.LastInsertId()
	return lastInsertID, err
}

// メールアドレスからmail_authを探してくる
func (r *mailAuthRepository) FindMailAuthByEmail(c context.Context, email string) *sql.Row {
	query := "select * from mail_auth where email= '" + email + "'"
	row := r.client.DB().QueryRowContext(c, query)
	fmt.Printf("\x1b[36m%s\n", query)
	return row
}

// mail_auth_idからmail_authを探してくる
func (r *mailAuthRepository) FindMailAuthByID(c context.Context, id string) *sql.Row {
	query := "select * from mail_auth where id= " + id
	row := r.client.DB().QueryRowContext(c, query)
	fmt.Printf("\x1b[36m%s\n", query)
	return row
}

// パスワードの変更
func (r *mailAuthRepository) ChangePasswordByUserID(c context.Context, userID string, password string) error {
	query := "UPDATE mail_auth SET password = '" + password + "' WHERE user_id = " + userID
	return r.crud.UpdateDB(c, query)
}
