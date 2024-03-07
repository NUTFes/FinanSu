package usecase

import (
	"context"
	"crypto/rand"
	"strconv"
	"fmt"

	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/pkg/errors"
	"golang.org/x/crypto/bcrypt"
)

type mailAuthUseCase struct {
	mailAuthRep rep.MailAuthRepository
	sessionRep  rep.SessionRepository
	sessionResetPasswordRep	rep.SessionResetPasswordRepository
}

type MailAuthUseCase interface {
	SignUp(context.Context, string, string, string) (domain.Token, error)
	SignIn(context.Context, string, string) (domain.Token, error)
	SignOut(context.Context, string) error
	IsSignIn(context.Context, string) (domain.IsSignIn, error)
	SendResetPassword(context.Context, string) (domain.Token, error)
}

func NewMailAuthUseCase(mailAuthRep rep.MailAuthRepository, sessionRep rep.SessionRepository, sessionResetPasswordRep rep.SessionResetPasswordRepository) MailAuthUseCase {
	return &mailAuthUseCase{mailAuthRep: mailAuthRep, sessionRep: sessionRep, sessionResetPasswordRep: sessionResetPasswordRep}
}

func (u *mailAuthUseCase) SignUp(c context.Context, email string, password string, userID string) (domain.Token, error) {
	var token domain.Token
	// パスワードをハッシュ化
	hashed, _ := bcrypt.GenerateFromPassword([]byte(password), 10)
	mailAuthID, err := u.mailAuthRep.CreateMailAuth(c, email, string(hashed), userID)
	// トークン発行
	accessToken, err := _makeRandomStr(10)
	if err != nil {
		return token, err
	}
	// ログイン（セッション開始）
	err = u.sessionRep.Create(c, strconv.FormatInt(mailAuthID, 10), userID, accessToken)
	if err != nil {
		return token, err
	}
	token.AccessToken = accessToken
	return token, nil
}

func (u *mailAuthUseCase) SignIn(c context.Context, email string, password string) (domain.Token, error) {
	var mailAuth = domain.MailAuth{}
	var token domain.Token
	// メールアドレスの存在確認
	row := u.mailAuthRep.FindMailAuthByEmail(c, email)
	err := row.Scan(
		&mailAuth.ID,
		&mailAuth.Email,
		&mailAuth.Password,
		&mailAuth.UserID,
		&mailAuth.CreatedAt,
		&mailAuth.UpdatedAt,
	)
	u.sessionRep.DestroyByUserID(c, strconv.Itoa(int(mailAuth.UserID)))
	// パスワードがあっているか確認
	err = bcrypt.CompareHashAndPassword([]byte(mailAuth.Password), []byte(password))
	if err != nil {
		return token, err
	}
	// トークン発行
	accessToken, err := _makeRandomStr(10)

	// ログイン (セッション開始)
	err = u.sessionRep.Create(c, strconv.FormatInt(int64(mailAuth.ID), 10), strconv.Itoa(int(mailAuth.UserID)), accessToken)
	if err != nil {
		return token, err
	}
	token.AccessToken = accessToken
	return token, nil
}

func (u *mailAuthUseCase) SignOut(c context.Context, accessToken string) error {
	err := u.sessionRep.Destroy(c, accessToken)
	if err != nil {
		return err
	}
	return nil
}

func (u *mailAuthUseCase) IsSignIn(c context.Context, accessToken string) (domain.IsSignIn, error) {
	var session = domain.Session{}
	var isSignIn domain.IsSignIn
	row := u.sessionRep.FindSessionByAccessToken(c, accessToken)
	_ = row.Scan(
		&session.ID,
		&session.AuthID,
		&session.UserID,
		&session.AccessToken,
		&session.CreatedAt,
		&session.UpdatedAt,
	)
	if session.ID != 0 {
		isSignIn = domain.IsSignIn{IsSignIn: true}
	} else {
		isSignIn = domain.IsSignIn{IsSignIn: false}
	}
	return isSignIn, nil
}

// reset password
func (u *mailAuthUseCase) SendResetPassword(c context.Context, email string) (domain.Token, error) {
	var mailAuth = domain.MailAuth{}
	var token domain.Token

	// メールアドレスの存在確認
	row := u.mailAuthRep.FindMailAuthByEmail(c, email)
	err := row.Scan(
		&mailAuth.ID,
		&mailAuth.Email,
		&mailAuth.Password,
		&mailAuth.UserID,
		&mailAuth.CreatedAt,
		&mailAuth.UpdatedAt,
	)
	if err != nil {
		fmt.Println(err)
		return token, err
	}
	u.sessionResetPasswordRep.DestroyByUserID(c, strconv.Itoa(int(mailAuth.UserID)))
	// トークン発行
	accessToken, err := _makeRandomStr(10)
	//  リセットセッション開始
	err = u.sessionResetPasswordRep.Create(c, strconv.FormatInt(int64(mailAuth.ID), 10), strconv.Itoa(int(mailAuth.UserID)), accessToken)
	if err != nil {
		return token, err
	}
	token.AccessToken = accessToken

	// メール送信
	receiverEmail := []string{email}
	err = u.mailAuthRep.SendResetPassword(c, receiverEmail)
	if err != nil {
		fmt.Println(err)
		return token, err
	}

	return token, nil
}

// アクセストークンを生成
func _makeRandomStr(digit uint32) (string, error) {
	const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

	// 乱数を生成
	b := make([]byte, digit)
	if _, err := rand.Read(b); err != nil {
		return "", errors.New("unexpected error...")
	}

	// letters からランダムに取り出して文字列を生成
	var result string
	for _, v := range b {
		// index が letters の長さに収まるように調整
		result += string(letters[int(v)%len(letters)])
	}
	return result, nil
}