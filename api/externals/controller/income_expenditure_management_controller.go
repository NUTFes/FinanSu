package controller

import (
	"fmt"
	"net/http"

	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/labstack/echo/v4"
)

type incomeExpenditureManagementController struct {
	u usecase.IncomeExpenditureManagementUseCase
}

type IncomeExpenditureManagementController interface {
	IndexIncomeExpenditureManagements(echo.Context) error
	PutIncomeExpenditureManagementCheck(echo.Context) error
}

func NewIncomeExpenditureManagementController(u usecase.IncomeExpenditureManagementUseCase) IncomeExpenditureManagementController {
	return &incomeExpenditureManagementController{u}
}

// Index
func (i *incomeExpenditureManagementController) IndexIncomeExpenditureManagements(c echo.Context) error {
	ctx := c.Request().Context()
	incomeExpenditureManagements, err := i.u.IndexIncomeExpenditureManagements(ctx)
	if err != nil {
		return err
	}
	fmt.Println("IndexIncomeExpenditureManagements")
	fmt.Println(incomeExpenditureManagements)
	return c.JSON(http.StatusOK, "not implemented")
}

// Put
func (i *incomeExpenditureManagementController) PutIncomeExpenditureManagementCheck(c echo.Context) error {
	return c.JSON(http.StatusOK, "not implemented")
}
