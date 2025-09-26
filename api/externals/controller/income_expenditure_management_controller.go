package controller

import (
	"net/http"

	"github.com/NUTFes/FinanSu/api/generated"
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
	year := c.QueryParam("year")

	incomeExpenditureManagements, err := i.u.IndexIncomeExpenditureManagements(ctx, year)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, incomeExpenditureManagements)
}

// Put
func (i *incomeExpenditureManagementController) PutIncomeExpenditureManagementCheck(c echo.Context) error {
	ctx := c.Request().Context()
	id := c.Param("id")
	var body generated.PutIncomeExpenditureManagementsCheckIdJSONBody
	if err := c.Bind(&body); err != nil {
		return err
	}

	if err := i.u.PutIncomeExpenditureManagementCheck(ctx, id, body.IsChecked); err != nil {
		return err
	}

	return c.JSON(http.StatusOK, "ok")
}

type (
	PutIncomeExpenditureManagementsCheckIdJSONBody = generated.PutIncomeExpenditureManagementsCheckIdJSONBody
)
