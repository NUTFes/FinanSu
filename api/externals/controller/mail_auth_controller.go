package controller

import (
	"net/http"

	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/labstack/echo/v4"
)

type mailAuthController struct {
	u usecase.MailAuthUseCase
}

type MailAuthController interface {
	SignUp(echo.Context) error
	SignIn(echo.Context) error
	SignOut(echo.Context) error
	IsSignIn(echo.Context) error
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
	return c.JSON(http.StatusOK, token)
}

// sign in
func (auth *mailAuthController) SignIn(c echo.Context) error {
	email := c.QueryParam("email")
	password := c.QueryParam("password")
	token, err := auth.u.SignIn(c.Request().Context(), email, password)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, token)
}

// sign out
func (auth *mailAuthController) SignOut(c echo.Context) error {
	// headerからトークンを取得する
	accessToken := c.Request().Header["Access-Token"][0]
	err := auth.u.SignOut(c.Request().Context(), accessToken)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Success Sign Out")
}

// ログインしてるかを確認
func (auth *mailAuthController) IsSignIn(c echo.Context) error {
	// headerからトークンを取得する
	accessToken := c.Request().Header["Access-Token"][0]
	isSignIn, err := auth.u.IsSignIn(c.Request().Context(), accessToken)
	if err != nil {
		return nil
	}
	return c.JSON(http.StatusOK, isSignIn)
}
