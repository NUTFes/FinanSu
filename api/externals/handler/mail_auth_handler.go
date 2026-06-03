package handler

import (
	"net/http"
	"strconv"

	"github.com/NUTFes/FinanSu/api/generated"
	"github.com/labstack/echo/v4"
)

// router.GET(baseURL+"/mail_auth/is_signin", wrapper.GetMailAuthIsSignin)
func (h *Handler) GetMailAuthIsSignin(c echo.Context, params generated.GetMailAuthIsSigninParams) error {
	// headerからトークンを取得する
	accessToken := params.AccessToken
	isSignIn, err := h.mailAuthUseCase.IsSignIn(c.Request().Context(), *accessToken)
	if err != nil {
		return nil
	}
	c.JSON(http.StatusOK, isSignIn)
	return nil
}

// router.POST(baseURL+"/mail_auth/signin", wrapper.PostMailAuthSignin)
func (h *Handler) PostMailAuthSignin(c echo.Context, params generated.PostMailAuthSigninParams) error {
	email := params.Email
	password := params.Password
	token, err := h.mailAuthUseCase.SignIn(c.Request().Context(), email, password)
	if err != nil {
		return err
	}
	c.JSON(http.StatusOK, token)
	return nil
}

// router.DELETE(baseURL+"/mail_auth/signout", wrapper.DeleteMailAuthSignout)
func (h *Handler) DeleteMailAuthSignout(c echo.Context, params generated.DeleteMailAuthSignoutParams) error {
	// headerからトークンを取得する
	accessToken := params.AccessToken
	err := h.mailAuthUseCase.SignOut(c.Request().Context(), *accessToken)
	if err != nil {
		return err
	}
	c.String(http.StatusOK, "Success Sign Out")
	return nil
}

// router.POST(baseURL+"/mail_auth/signup", wrapper.PostMailAuthSignup)
func (h *Handler) PostMailAuthSignup(c echo.Context) error {
	var request generated.PostMailAuthSignupJSONRequestBody
	if err := c.Bind(&request); err != nil {
		return err
	}

	email := request.Email
	password := request.Password
	name := request.Name
	bureauID := strconv.Itoa(request.BureauId)
	roleID := strconv.Itoa(request.RoleId)
	token, err := h.mailAuthUseCase.SignUp(c.Request().Context(), email, password, name, bureauID, roleID)
	if err != nil {
		return err
	}
	c.JSON(http.StatusOK, token)
	return nil
}
