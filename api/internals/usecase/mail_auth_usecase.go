package usecase

import (
	"context"
	"crypto/rand"
	"strconv"

	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/pkg/errors"
	"golang.org/x/crypto/bcrypt"
)

type mailAuthUseCase struct {
	mailAuthRep    rep.MailAuthRepository
	sessionRep     rep.SessionRepository
	userRep        rep.UserRepository
	transactionRep rep.TransactionRepository
}

type MailAuthUseCase interface {
	SignUp(context.Context, string, string, string, string, string) (domain.Token, error)
	SignIn(context.Context, string, string) (domain.Token, error)
	SignOut(context.Context, string) error
	IsSignIn(context.Context, string) (domain.IsSignIn, error)
}

func NewMailAuthUseCase(
	mailAuthRep rep.MailAuthRepository,
	sessionRep rep.SessionRepository,
	userRep rep.UserRepository,
	transactionRep rep.TransactionRepository,
) MailAuthUseCase {
	return &mailAuthUseCase{
		mailAuthRep:    mailAuthRep,
		sessionRep:     sessionRep,
		userRep:        userRep,
		transactionRep: transactionRep,
	}
}

func (u *mailAuthUseCase) SignUp(c context.Context, email string, password string, name string, bureauID string, roleID string) (domain.Token, error) {
	var token domain.Token

	// パスワードをハッシュ化
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	if err != nil {
		return token, err
	}

	tx, err := u.transactionRep.StartTransaction(c)
	if err != nil {
		return token, err
	}

	userID, err := u.userRep.CreateWithTx(c, tx, name, bureauID, roleID)
	if err != nil {
		_ = u.transactionRep.RollBack(c, tx)
		return token, err
	}
	userIDStr := strconv.FormatInt(userID, 10)

	mailAuthID, err := u.mailAuthRep.CreateMailAuthWithTx(c, tx, email, string(hashed), userIDStr)
	if err != nil {
		_ = u.transactionRep.RollBack(c, tx)
		return token, err
	}

	// トークン発行
	accessToken, err := _makeRandomStr(10)
	if err != nil {
		_ = u.transactionRep.RollBack(c, tx)
		return token, err
	}
	// ログイン（セッション開始）
	err = u.sessionRep.CreateWithTx(c, tx, strconv.FormatInt(mailAuthID, 10), userIDStr, accessToken)
	if err != nil {
		_ = u.transactionRep.RollBack(c, tx)
		return token, err
	}

	if err = u.transactionRep.Commit(c, tx); err != nil {
		_ = u.transactionRep.RollBack(c, tx)
		return token, err
	}

	token.AccessToken = accessToken
	token.UserID = int(userID)
	return token, nil
}

func (u *mailAuthUseCase) SignIn(c context.Context, email string, password string) (domain.Token, error) {
	var mailAuth = domain.MailAuth{}
	var token domain.Token
	// メールアドレスの存在確認
	row, err := u.mailAuthRep.FindMailAuthByEmail(c, email)
	if err != nil {
		return token, err
	}

	err = row.Scan(
		&mailAuth.ID,
		&mailAuth.Email,
		&mailAuth.Password,
		&mailAuth.UserID,
		&mailAuth.CreatedAt,
		&mailAuth.UpdatedAt,
	)
	if err != nil {
		return token, errors.New("メールアドレスが存在しません")
	}
	if err = u.sessionRep.DestroyByUserID(c, strconv.Itoa(int(mailAuth.UserID))); err != nil {
		return token, err
	}
	// パスワードがあっているか確認
	if err = bcrypt.CompareHashAndPassword([]byte(mailAuth.Password), []byte(password)); err != nil {
		return token, err
	}

	// トークン発行
	accessToken, err := _makeRandomStr(10)
	if err != nil {
		return token, err
	}

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
	row, err := u.sessionRep.FindSessionByAccessToken(c, accessToken)
	if err != nil {
		return isSignIn, err
	}

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
