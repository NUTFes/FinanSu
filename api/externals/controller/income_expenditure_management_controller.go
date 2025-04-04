package controller

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

type incomeExpenditureManagementController struct {
}

type IncomeExpenditureManagementController interface {
	IndexIncomeExpenditureManagements(echo.Context) error
	PutIncomeExpenditureManagementCheck(echo.Context) error
}

func NewIncomeExpenditureManagementController() IncomeExpenditureManagementController {
	return &incomeExpenditureManagementController{}
}

// Index
func (i *incomeExpenditureManagementController) IndexIncomeExpenditureManagements(c echo.Context) error {
	return c.JSON(http.StatusOK, "not implemented")
}

// Put
func (i *incomeExpenditureManagementController) PutIncomeExpenditureManagementCheck(c echo.Context) error {
	return c.JSON(http.StatusOK, "not implemented")
}
