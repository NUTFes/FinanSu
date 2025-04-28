package usecase

import (
	"context"
	"log"
	"strconv"
	"time"

	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/pkg/errors"
	"golang.org/x/crypto/bcrypt"
)

type passwordResetTokenUseCase struct {
	tokenRep rep.PasswordResetTokenRepository
	userRep  rep.UserRepository
	authRep  rep.MailAuthRepository
}

type PasswordResetTokenUseCase interface {
	GetPasswordResetTokens(context.Context) ([]domain.PasswordResetToken, error)
	GetPasswordResetTokenByID(context.Context, string) (domain.PasswordResetToken, error)
	CreatePasswordResetToken(context.Context, string, string) (domain.PasswordResetToken, error)
	UpdatePasswordResetToken(context.Context, string, string, string) (domain.PasswordResetToken, error)
	DestroyPasswordResetToken(context.Context, string) error
	PasswordResetTokenRequest(context.Context, string) error
	ValidPasswordResetToken(context.Context, string, string) error
	ChangePassword(context.Context, string, string) error
}

func NewPasswordResetTokenUseCase(tokenRep rep.PasswordResetTokenRepository, userRep rep.UserRepository, authRep rep.MailAuthRepository) PasswordResetTokenUseCase {
	return &passwordResetTokenUseCase{tokenRep, userRep, authRep}
}

func (p *passwordResetTokenUseCase) GetPasswordResetTokens(c context.Context) ([]domain.PasswordResetToken, error) {

	passwordResetToken := domain.PasswordResetToken{}
	var passwordResetTokens []domain.PasswordResetToken

	// クエリー実行
	rows, err := p.tokenRep.All(c)
	if err != nil {
		return nil, err
	}
	defer func() {
		if err := rows.Close(); err != nil {
			log.Println(err)
		}
	}()

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
	row, err := p.tokenRep.Find(c, id)
	if err != nil {
		return passwordResetToken, err
	}

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
	err := p.tokenRep.Create(c, userID, token)
	if err != nil {
		return latastPasswordResetToken, err
	}
	row, err := p.tokenRep.FindLatestRecord(c)
	if err != nil {
		return latastPasswordResetToken, err
	}
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
	if err := p.tokenRep.Update(c, id, userID, token); err != nil {
		return updatedPasswordResetToken, err
	}

	row, err := p.tokenRep.Find(c, id)
	if err != nil {
		return updatedPasswordResetToken, err
	}

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
	err := p.tokenRep.Destroy(c, id)
	return err
}

// パスワードリセットリクエスト処理
func (p *passwordResetTokenUseCase) PasswordResetTokenRequest(c context.Context, email string) error {
	user := domain.User{}
	mailAuth := domain.MailAuth{}
	latestPasswordResetToken := domain.PasswordResetToken{}

	// userとemailを取得
	row, err := p.userRep.FindByEmail(c, email)
	if err != nil {
		return err
	}

	if err = row.Scan(
		&user.ID,
		&user.Name,
		&user.BureauID,
		&user.RoleID,
		&user.IsDeleted,
		&user.CreatedAt,
		&user.UpdatedAt,
		&mailAuth.ID,
		&mailAuth.Email,
		&mailAuth.Password,
		&mailAuth.UserID,
		&mailAuth.CreatedAt,
		&mailAuth.UpdatedAt,
	); err != nil {
		return err
	}

	if mailAuth.Email == "" {
		err = errors.New("emailが正しくありません")
		return err
	}

	// トークン発行
	passwordResetToken, err := _makeRandomStr(20)
	if err != nil {
		return err
	}

	// トークンをハッシュ化(dbに保存用)
	hashedPasswordResetToken, err := bcrypt.GenerateFromPassword([]byte(passwordResetToken), 10)
	if err != nil {
		return err
	}

	// トークンを保存
	err = p.tokenRep.CreateWithTime(c, strconv.Itoa(user.ID), string(hashedPasswordResetToken))
	if err != nil {
		return err
	}

	//トークンの取得
	row, err = p.tokenRep.FindByToken(c, string(hashedPasswordResetToken))
	if err != nil {
		return err
	}

	if err = row.Scan(
		&latestPasswordResetToken.ID,
		&latestPasswordResetToken.UserID,
		&latestPasswordResetToken.Token,
		&latestPasswordResetToken.CreatedAt,
		&latestPasswordResetToken.UpdatedAt,
	); err != nil {
		return err
	}

	// リセットメールの送信
	err = p.tokenRep.SendResetEmail(c, strconv.Itoa(int(latestPasswordResetToken.ID)), user.Name, mailAuth.Email, passwordResetToken)
	return err
}

// トークンの称号処理
func (p *passwordResetTokenUseCase) ValidPasswordResetToken(c context.Context, id string, token string) error {
	passwordResetToken := domain.PasswordResetToken{}

	// トークンを取得
	row, err := p.tokenRep.Find(c, id)
	if err != nil {
		return err
	}

	if err = row.Scan(
		&passwordResetToken.ID,
		&passwordResetToken.UserID,
		&passwordResetToken.Token,
		&passwordResetToken.CreatedAt,
		&passwordResetToken.UpdatedAt,
	); err != nil {
		return err
	}

	// トークンが有効か
	if err = bcrypt.CompareHashAndPassword([]byte(passwordResetToken.Token), []byte(token)); err != nil {
		return errors.New("トークンが正しくありません")
	}

	// 有効期限が過ぎていないか
	if time.Now().After(passwordResetToken.CreatedAt.Add(1 * time.Hour)) {
		if err = errors.New("トークンの有効期限が切れています"); err != nil {
			return err
		}
		//トークンのレコード削除
		if err := p.tokenRep.DestroyByUserID(c, strconv.Itoa(passwordResetToken.UserID)); err != nil {
			return err
		}
		return err
	}

	return err
}

// パスワードの変更
func (p *passwordResetTokenUseCase) ChangePassword(c context.Context, id string, password string) error {
	// トークンの取得(userIDを取得するため)
	passwordResetToken := domain.PasswordResetToken{}
	row, err := p.tokenRep.Find(c, id)
	if err != nil {
		return err
	}

	err = row.Scan(
		&passwordResetToken.ID,
		&passwordResetToken.UserID,
		&passwordResetToken.Token,
		&passwordResetToken.CreatedAt,
		&passwordResetToken.UpdatedAt,
	)

	if err != nil {
		err = errors.New("トークンの取得に失敗しました")
		return err
	}

	// パスワードのハッシュ化
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	if err != nil {
		return err
	}

	//パスワードの変更
	if err = p.authRep.ChangePasswordByUserID(c, strconv.Itoa(passwordResetToken.UserID), string(hashedPassword)); err != nil {
		return err
	}

	//トークンの削除
	if err = p.tokenRep.DestroyByUserID(c, strconv.Itoa(passwordResetToken.UserID)); err != nil {
		return err
	}

	return nil
}
