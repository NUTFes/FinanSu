package controller

import (
	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/labstack/echo/v4"
	"net/http"
)

type mailAuthController struct {
	u usecase.MailAuthUseCase
}

type MailAuthController interface {
	SignUp(echo.Context) error
	SignIn(echo.Context) error
	SignOut(echo.Context) error
	IsSignIn(echo.Context) error
	SendResetPassword(echo.Context) error
}

func NewMailAuthController(u usecase.MailAuthUseCase) MailAuthController {
	return &mailAuthController{u}
}

// sign up
func (auth *mailAuthController) SignUp(c echo.Context) error {
	email := c.QueryParam("email")
	password := c.QueryParam("password")
	userID := c.QueryParam("user_id")
	token, err := auth.u.SignUp(c.Request().Context(), email, password, userID)
	if err != nil {
		return err
	}
	c.JSON(http.StatusOK, token)
	return nil
}

// sign in
func (auth *mailAuthController) SignIn(c echo.Context) error {
	email := c.QueryParam("email")
	password := c.QueryParam("password")
	token, err := auth.u.SignIn(c.Request().Context(), email, password)
	if err != nil {
		return err
	}
	c.JSON(http.StatusOK, token)
	return nil
}

// sign out
func (auth *mailAuthController) SignOut(c echo.Context) error {
	// headerからトークンを取得する
	accessToken := c.Request().Header["Access-Token"][0]
	err := auth.u.SignOut(c.Request().Context(), accessToken)
	if err != nil {
		return err
	}
	c.String(http.StatusOK, "Success Sign Out")
	return nil
}

// ログインしてるかを確認
func (auth *mailAuthController) IsSignIn(c echo.Context) error {
	// headerからトークンを取得する
	accessToken := c.Request().Header["Access-Token"][0]
	isSignIn, err := auth.u.IsSignIn(c.Request().Context(), accessToken)
	if err != nil {
		return nil
	}
	c.JSON(http.StatusOK, isSignIn)
	return nil
}

// reset password
func (auth *mailAuthController) SendResetPassword(c echo.Context) error {
	email := c.QueryParam("email")
	token, err := auth.u.SendResetPassword(c.Request().Context(), email)
	if err != nil {
		return err
	}
	c.JSON(http.StatusOK, token)
	return nil
}