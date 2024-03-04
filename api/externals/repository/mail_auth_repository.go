package repository

import (
	"context"
	"net/smtp"
	"database/sql"
	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/joho/godotenv"
	"fmt"
	"os"
)

type mailAuthRepository struct {
	client db.Client
}

type MailAuthRepository interface {
	CreateMailAuth(context.Context, string, string, string) (int64, error)
	FindMailAuthByEmail(context.Context, string) *sql.Row
	FindMailAuthByID(context.Context, string) *sql.Row
	SendResetPassword(context.Context, []string) error
}

func NewMailAuthRepository(client db.Client) MailAuthRepository {
	return &mailAuthRepository{client}
}

// 作成
func (r *mailAuthRepository) CreateMailAuth(c context.Context, email string, password string, userID string) (int64, error) {
	result, err := r.client.DB().ExecContext(c, "insert into mail_auth (email, password, user_id) values ('"+email+"','"+password+"',"+userID+")")
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

// reset password
func (r *mailAuthRepository) SendResetPassword(c context.Context, email []string) error {
	err := godotenv.Load("env/dev.env")
	if err != nil {
		fmt.Println(err)
	}

	mailSender := os.Getenv("NUTMEG_MAIL_SENDER")
	mailPassword := os.Getenv("NUTMEG_MAIL_PASSWORD")
	resetPageUrl := os.Getenv("RESET_PASSWORD_URL")

	message := []byte("From: 情報局 <" + mailSender + ">\r\n" + 
		"Subject: FinanSu パスワードリセットの確認メール\r\n\r\n" + 
		"お世話になっております。\r\n情報局 FinanSu 担当です。\r\n\r\n" + 
		"FinanSuに登録している本メールアドレスのパスワードをリセットするためには、下記のURLから手続きを行ってください。\r\n" +
		"なお、パスワードのリセットの有効期限は本メールが送信されてから10分間とさせていただきます。\r\n" + 
		"今後ともよろしくお願いいたします。\r\n\r\n" +
		"FinanSu: " + resetPageUrl)

	smtpHost := "smtp.gmail.com"
	smtpPort := "587"

	// Authenyication
	auth := smtp.PlainAuth("", mailSender, mailPassword, smtpHost)

	// send email
	err = smtp.SendMail(smtpHost+":"+smtpPort, auth, mailSender, email, message)
	if err != nil {
		fmt.Println(err)
		return err
	}
	fmt.Println("Sent password reset mail for " + email[0])
	return nil
}
