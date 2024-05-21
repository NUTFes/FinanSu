package usecase

import (
	"context"
	"fmt"
	"strconv"

	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/pkg/errors"
	"golang.org/x/crypto/bcrypt"
)

type passwordResetTokenUseCase struct {
	rep rep.PasswordResetTokenRepository
	rep2 rep.UserRepository
}

type PasswordResetTokenUseCase interface {
	GetPasswordResetTokens(context.Context) ([]domain.PasswordResetToken, error)
	GetPasswordResetTokenByID(context.Context, string) (domain.PasswordResetToken, error)
	CreatePasswordResetToken(context.Context, string, string) (domain.PasswordResetToken, error)
	UpdatePasswordResetToken(context.Context, string, string, string) (domain.PasswordResetToken, error)
	DestroyPasswordResetToken(context.Context, string) error
	PasswordResetTokenRequest(context.Context, string) error
}

func NewPasswordResetTokenUseCase(rep rep.PasswordResetTokenRepository, rep2 rep.UserRepository) PasswordResetTokenUseCase {
	return &passwordResetTokenUseCase{rep, rep2}
}

func (p *passwordResetTokenUseCase) GetPasswordResetTokens(c context.Context) ([]domain.PasswordResetToken, error) {

	passwordResetToken := domain.PasswordResetToken{}
	var passwordResetTokens []domain.PasswordResetToken

	// クエリー実行
	rows, err := p.rep.All(c)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		err := rows.Scan(
			&passwordResetToken.ID,
			&passwordResetToken.UserID,
			&passwordResetToken.Token,
			&passwordResetToken.CreatedAt,
			&passwordResetToken.UpdatedAt,
		)

		if err != nil {
			return nil, errors.Wrapf(err, "cannot connect SQL")
		}

		passwordResetTokens = append(passwordResetTokens, passwordResetToken)
	}
	return passwordResetTokens, nil
}

func (p *passwordResetTokenUseCase) GetPasswordResetTokenByID(c context.Context, id string) (domain.PasswordResetToken, error) {
	var passwordResetToken domain.PasswordResetToken
	row, err := p.rep.Find(c, id)
	err = row.Scan(
		&passwordResetToken.ID,
		&passwordResetToken.UserID,
		&passwordResetToken.Token,
		&passwordResetToken.CreatedAt,
		&passwordResetToken.UpdatedAt,
	)
	if err != nil {
		return passwordResetToken, err
	}
	return passwordResetToken, nil
}

func (p *passwordResetTokenUseCase) CreatePasswordResetToken(c context.Context, userID string, token string) (domain.PasswordResetToken, error) {
	latastPasswordResetToken := domain.PasswordResetToken{}
	err := p.rep.Create(c, userID, token)
	row, err := p.rep.FindLatestRecord(c)
	err = row.Scan(
		&latastPasswordResetToken.ID,
		&latastPasswordResetToken.UserID,
		&latastPasswordResetToken.Token,
		&latastPasswordResetToken.CreatedAt,
		&latastPasswordResetToken.UpdatedAt,
	)
	if err != nil {
		return latastPasswordResetToken, err
	}
	return latastPasswordResetToken, err
}

func (p *passwordResetTokenUseCase) UpdatePasswordResetToken(c context.Context, id string, userID string, token string) (domain.PasswordResetToken, error) {
	updatedPasswordResetToken := domain.PasswordResetToken{}
	err := p.rep.Update(c, id, userID, token)
	row, err := p.rep.Find(c,id)
	err = row.Scan(
		&updatedPasswordResetToken.ID,
		&updatedPasswordResetToken.UserID,
		&updatedPasswordResetToken.Token,
		&updatedPasswordResetToken.CreatedAt,
		&updatedPasswordResetToken.UpdatedAt,
	)
	if err != nil {
		return updatedPasswordResetToken, err
	}
	return updatedPasswordResetToken, err
}

func (p *passwordResetTokenUseCase) DestroyPasswordResetToken(c context.Context, id string) error {
	err := p.rep.Destroy(c, id)
	return err
}

//パスワードリセットリクエスト処理
func (p *passwordResetTokenUseCase) PasswordResetTokenRequest(c context.Context, email string) error {
	user := domain.User{}
	mailAuth := domain.MailAuth{}
	
	// userとemailを取得
	row, err := p.rep2.FindByEmail(c, email)
	row.Scan(
		&user.ID,
		&user.Name,
		&user.BureauID,
		&user.RoleID,
		&user.CreatedAt,
		&user.UpdatedAt,
		&mailAuth.ID,
		&mailAuth.Email,
		&mailAuth.Password,
		&mailAuth.UserID,
		&mailAuth.CreatedAt,
		&mailAuth.UpdatedAt,
	)

	if (mailAuth.Email == ""){
		fmt.Println("emailは登録されていません")
		return err
	}

	// トークン発行
	passwordResetToken, err := _makeRandomStr(20)
	fmt.Println(passwordResetToken)

	// トークンをハッシュ化(dbに保存用)
	hashedPasswordResetToken, err :=  bcrypt.GenerateFromPassword([]byte(passwordResetToken), 10)
	fmt.Println(string(hashedPasswordResetToken))

	// トークンを保存
	err = p.rep.Create(c, strconv.Itoa(user.ID), string(hashedPasswordResetToken))

	// リセットメールの送信
	err = p.rep.SendResetEmail(c,user.Name , mailAuth.Email, passwordResetToken)

	return err
}
