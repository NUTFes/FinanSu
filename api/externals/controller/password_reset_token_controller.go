package controller

import (
	"errors"
	"net/http"

	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/labstack/echo/v4"
)

type passwordResetTokenController struct {
	u usecase.PasswordResetTokenUseCase
}

type PasswordResetTokenController interface {
	IndexPasswordResetTokens(echo.Context) error
	ShowPasswordResetToken(echo.Context) error
	CreatePasswordResetToken(echo.Context) error
	UpdatePasswordResetToken(echo.Context) error
	DestroyPasswordResetToken(echo.Context) error
	SendPasswordResetRequest(echo.Context) error
	ValidPasswordResetToken(echo.Context) error
	ChangePassword(echo.Context) error
}

func NewPasswordResetTokenController(u usecase.PasswordResetTokenUseCase) PasswordResetTokenController {
	return &passwordResetTokenController{u}
}

// Index
func (p *passwordResetTokenController) IndexPasswordResetTokens(c echo.Context) error {
	passwordResetTokens, err := p.u.GetPasswordResetTokens(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, passwordResetTokens)
}

// Show
func (p *passwordResetTokenController) ShowPasswordResetToken(c echo.Context) error {
	id := c.Param("id")
	passwordResetToken, err := p.u.GetPasswordResetTokenByID(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, passwordResetToken)
}

// Create
func (p *passwordResetTokenController) CreatePasswordResetToken(c echo.Context) error {
	userID := c.QueryParam("userID")
	token := c.QueryParam("token")
	latastPasswordResetToken, err := p.u.CreatePasswordResetToken(c.Request().Context(), userID, token)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusCreated, latastPasswordResetToken)
}

// Update
func (p *passwordResetTokenController) UpdatePasswordResetToken(c echo.Context) error {
	id := c.Param("id")
	userID := c.QueryParam("userID")
	token := c.QueryParam("token")
	updatedPasswordResetToken, err := p.u.UpdatePasswordResetToken(c.Request().Context(), id, userID, token)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, updatedPasswordResetToken)
}

// Destroy
func (p *passwordResetTokenController) DestroyPasswordResetToken(c echo.Context) error {
	id := c.Param("id")
	err := p.u.DestroyPasswordResetToken(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Destroy PasswordResetToken")
}

// パスワード変更リクエスト
func (p *passwordResetTokenController) SendPasswordResetRequest(c echo.Context) error {
	email := c.QueryParam("email")
	err := p.u.PasswordResetTokenRequest(c.Request().Context(), email)
	if err != nil {
		return c.String(http.StatusOK, err.Error())
	}
	return c.String(http.StatusOK, "PasswordResetTokenを送信しました")
}

// トークンが有効チェック
func (p *passwordResetTokenController) ValidPasswordResetToken(c echo.Context) error {
	id := c.Param("id")
	token := c.QueryParam("token")
	err := p.u.ValidPasswordResetToken(c.Request().Context(), id, token)
	if err != nil {
		return c.String(http.StatusBadRequest, err.Error())
	} 	

	return c.String(http.StatusOK, "Tokenは有効です")
}


// パスワード変更
func (p *passwordResetTokenController) ChangePassword(c echo.Context) error {
	id := c.Param("id")
	passwordResetData := new(domain.PasswordResetData)

	if err := c.Bind(passwordResetData); err != nil {
		return err
	}

	//トークンの有効チェック
	err := p.u.ValidPasswordResetToken(c.Request().Context(), id, passwordResetData.Token)
	if err != nil {
		return c.String(http.StatusBadRequest, err.Error())
	} 	

	//パスワードのバリデーション
	isValidPassword := passwordResetData.Password != passwordResetData.ConfirmPassword || passwordResetData.Password == "" || len(passwordResetData.Password)<6
	if isValidPassword {
		err = errors.New("パスワードが不正です")
		return c.String(http.StatusBadRequest, err.Error())
	}

	//パスワード変更
	err = p.u.ChangePassword(c.Request().Context(), id, passwordResetData.Password)
	if err != nil {
		return c.String(http.StatusBadRequest, err.Error())
	} 	

	return c.String(http.StatusOK, "パスワードを変更しました")
}
