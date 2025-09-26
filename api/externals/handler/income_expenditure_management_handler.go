package handler

import (
	"net/http"
	"strconv"

	"github.com/NUTFes/FinanSu/api/generated"
	"github.com/labstack/echo/v4"
)

// Index
func (h *Handler) GetIncomeExpenditureManagements(c echo.Context, params generated.GetIncomeExpenditureManagementsParams) error {
	ctx := c.Request().Context()
	var yearStr string
	if params.Year != nil {
		yearStr = strconv.Itoa(*params.Year)
	}
	incomeExpenditureManagements, err := h.incomeExpenditureManagementUseCase.IndexIncomeExpenditureManagements(ctx, yearStr)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, incomeExpenditureManagements)
}

// PutIncomeExpenditureManagementsCheckId
func (h *Handler) PutIncomeExpenditureManagementsCheckId(c echo.Context, id int) error {
	ctx := c.Request().Context()

	var body generated.PutIncomeExpenditureManagementsCheckIdJSONBody
	if err := c.Bind(&body); err != nil {
		return err
	}
	idStr := strconv.Itoa(id)

	if err := h.incomeExpenditureManagementUseCase.PutIncomeExpenditureManagementCheck(ctx, idStr, body.IsChecked); err != nil {
		return err
	}

	return c.JSON(http.StatusOK, "ok")
}

type (
	PutIncomeExpenditureManagementsCheckIdJSONBody = generated.PutIncomeExpenditureManagementsCheckIdJSONBody
)
