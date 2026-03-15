package handler

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/NUTFes/FinanSu/api/generated"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/labstack/echo/v4"
)

// router.POST(baseURL+"/password_reset/request", wrapper.PostPasswordResetRequest)
func (h *Handler) PostPasswordResetRequest(c echo.Context, params generated.PostPasswordResetRequestParams) error {
	email := params.Email
	err := h.passwordResetTokenUseCase.PasswordResetTokenRequest(c.Request().Context(), *email)
	if err != nil {
		return c.String(http.StatusOK, err.Error())
	}
	return c.String(http.StatusOK, "PasswordResetTokenを送信しました")
}

// router.POST(baseURL+"/password_reset/:id", wrapper.PostPasswordResetId)
func (h *Handler) PostPasswordResetId(c echo.Context, id int) error {
	idStr := strconv.Itoa(id)
	passwordResetData := new(domain.PasswordResetData)

	if err := c.Bind(passwordResetData); err != nil {
		return err
	}

	//トークンの有効チェック
	err := h.passwordResetTokenUseCase.ValidPasswordResetToken(c.Request().Context(), idStr, passwordResetData.Token)
	if err != nil {
		return c.String(http.StatusBadRequest, err.Error())
	}

	//パスワードのバリデーション
	isValidPassword := passwordResetData.Password != passwordResetData.ConfirmPassword || passwordResetData.Password == "" || len(passwordResetData.Password) < 6
	if isValidPassword {
		err = errors.New("パスワードが不正です")
		return c.String(http.StatusBadRequest, err.Error())
	}

	//パスワード変更
	err = h.passwordResetTokenUseCase.ChangePassword(c.Request().Context(), idStr, passwordResetData.Password)
	if err != nil {
		return c.String(http.StatusBadRequest, err.Error())
	}

	return c.String(http.StatusOK, "パスワードを変更しました")
}

// router.POST(baseURL+"/password_reset/:id/valid", wrapper.PostPasswordResetIdValid)
func (h *Handler) PostPasswordResetIdValid(c echo.Context, id int, params generated.PostPasswordResetIdValidParams) error {
	idStr := strconv.Itoa(id)
	token := params.Token
	err := h.passwordResetTokenUseCase.ValidPasswordResetToken(c.Request().Context(), idStr, *token)
	if err != nil {
		return c.String(http.StatusBadRequest, err.Error())
	}

	return c.String(http.StatusOK, "Tokenは有効です")
}
