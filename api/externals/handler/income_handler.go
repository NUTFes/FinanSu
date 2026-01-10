package handler

import (
	"net/http"
	"strconv"

	"github.com/NUTFes/FinanSu/api/generated"
	"github.com/labstack/echo/v4"
)

// Get all income categories
func (h *Handler) GetIncomes(c echo.Context) error {
	ctx := c.Request().Context()
	incomeCategories, err := h.incomeUseCase.GetAllIncome(ctx)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "failed to get all income items")
	}
	return c.JSON(http.StatusOK, incomeCategories)
}

// PostIncome creates a new income category
func (h *Handler) PostIncomes(c echo.Context) error {
	ctx := c.Request().Context()
	var income Income
	if err := c.Bind(&income); err != nil {
		return c.JSON(http.StatusBadRequest, "failed to bind")
	}
	createdIncome, err := h.incomeUseCase.CreateIncome(ctx, income)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, createdIncome)
}

// GET /incomes/:id
func (h *Handler) GetIncomesId(c echo.Context, id int) error {
	ctx := c.Request().Context()
	idStr := strconv.Itoa(id)

	income, err := h.incomeUseCase.GetIncome(ctx, idStr)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "failed to get income")
	}
	if income == nil {
		return c.JSON(http.StatusNotFound, "income not found")
	}
	return c.JSON(http.StatusOK, income)
}

// PUT /incomes/:id
func (h *Handler) PutIncomesId(c echo.Context, id int) error {
	ctx := c.Request().Context()
	idStr := strconv.Itoa(id)

	var income Income
	if err := c.Bind(&income); err != nil {
		return c.JSON(http.StatusBadRequest, "failed to bind")
	}
	updatedIncome, err := h.incomeUseCase.UpdateIncome(ctx, idStr, income)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	// Return the updated income
	return c.JSON(http.StatusOK, updatedIncome)
}

// DELETE /incomes/:id
func (h *Handler) DeleteIncomesId(c echo.Context, id int) error {
	ctx := c.Request().Context()

	if err := h.incomeUseCase.DeleteIncome(ctx, strconv.Itoa(id)); err != nil {
		return c.JSON(http.StatusInternalServerError, "failed to delete income")
	}
	return c.JSON(http.StatusOK, "ok")
}

type (
	Income = generated.Income
)
