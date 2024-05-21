package controller

import (
	"net/http"

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
