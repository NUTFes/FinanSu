package controller

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

type incomeController struct {
}

type IncomeController interface {
	PostIncome(c echo.Context) error
	GetIncome(c echo.Context) error
	PutIncome(c echo.Context) error
	DeleteIncome(c echo.Context) error
}

func NewIncomeController() IncomeController {
	return &incomeController{}
}

// Post
func (i *incomeController) PostIncome(c echo.Context) error {
	return c.JSON(http.StatusOK, "ok")
}

// GET
func (i *incomeController) GetIncome(c echo.Context) error {
	return c.JSON(http.StatusOK, "ok")
}

// PUT
func (i *incomeController) PutIncome(c echo.Context) error {
	return c.JSON(http.StatusOK, "ok")
}

// DELETE
func (i *incomeController) DeleteIncome(c echo.Context) error {
	return c.JSON(http.StatusOK, "ok")
}
