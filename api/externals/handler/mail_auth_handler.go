package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// router.GET(baseURL+"/mail_auth/is_signin", wrapper.GetMailAuthIsSignin)
func (h *Handler) GetMailAuthIsSignin(c echo.Context) error {
	// headerからトークンを取得する
	accessToken := c.Request().Header["Access-Token"][0]
	isSignIn, err := h.mailAuthUseCase.IsSignIn(c.Request().Context(), accessToken)
	if err != nil {
		return nil
	}
	c.JSON(http.StatusOK, isSignIn)
	return nil
}

// router.POST(baseURL+"/mail_auth/signin", wrapper.PostMailAuthSignin)
func (h *Handler) PostMailAuthSignin(c echo.Context) error {
	email := c.QueryParam("email")
	password := c.QueryParam("password")
	token, err := h.mailAuthUseCase.SignIn(c.Request().Context(), email, password)
	if err != nil {
		return err
	}
	c.JSON(http.StatusOK, token)
	return nil
}

// router.DELETE(baseURL+"/mail_auth/signout", wrapper.DeleteMailAuthSignout)
func (h *Handler) DeleteMailAuthSignout(c echo.Context) error {
	// headerからトークンを取得する
	accessToken := c.Request().Header["Access-Token"][0]
	err := h.mailAuthUseCase.SignOut(c.Request().Context(), accessToken)
	if err != nil {
		return err
	}
	c.String(http.StatusOK, "Success Sign Out")
	return nil
}

// router.POST(baseURL+"/mail_auth/signup", wrapper.PostMailAuthSignup)
func (h *Handler) PostMailAuthSignup(c echo.Context) error {
	email := c.QueryParam("email")
	password := c.QueryParam("password")
	userID := c.QueryParam("user_id")
	token, err := h.mailAuthUseCase.SignUp(c.Request().Context(), email, password, userID)
	if err != nil {
		return err
	}
	c.JSON(http.StatusOK, token)
	return nil
}
