package controller

import (
	"net/http"

	"github.com/NUTFes/FinanSu/api/generated"
	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/labstack/echo/v4"
)

type incomeController struct {
	u usecase.IncomeUseCase
}

type IncomeController interface {
	IndexIncome(c echo.Context) error
	PostIncome(c echo.Context) error
	GetIncome(c echo.Context) error
	PutIncome(c echo.Context) error
	DeleteIncome(c echo.Context) error
}

func NewIncomeController(
	u usecase.IncomeUseCase,
) IncomeController {
	return &incomeController{u}
}

// Get all incomeCategories
func (i *incomeController) IndexIncome(c echo.Context) error {
	ctx := c.Request().Context()
	incomeCategories, err := i.u.GetAllIncome(ctx)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "failed to get all income items")
	}
	return c.JSON(http.StatusOK, incomeCategories)
}

// Post
func (i *incomeController) PostIncome(c echo.Context) error {
	ctx := c.Request().Context()
	var income Income
	if err := c.Bind(&income); err != nil {
		return c.JSON(http.StatusBadRequest, "failed to bind")
	}

	createdIncome, err := i.u.CreateIncome(ctx, income)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, createdIncome)
}

// GET
func (i *incomeController) GetIncome(c echo.Context) error {
	ctx := c.Request().Context()
	incomeID := c.Param("id")
	if incomeID == "" {
		return c.JSON(http.StatusBadRequest, "income ID is required")
	}

	income, err := i.u.GetIncome(ctx, incomeID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "failed to get income")
	}
	if income == nil {
		return c.JSON(http.StatusNotFound, "income not found")
	}
	return c.JSON(http.StatusOK, income)
}

// PUT
func (i *incomeController) PutIncome(c echo.Context) error {
	ctx := c.Request().Context()
	incomeID := c.Param("id")
	if incomeID == "" {
		return c.JSON(http.StatusBadRequest, "income ID is required")
	}

	var income Income
	if err := c.Bind(&income); err != nil {
		return c.JSON(http.StatusBadRequest, "failed to bind")
	}
	updatedIncome, err := i.u.UpdateIncome(ctx, incomeID, income)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	// Return the updated income
	return c.JSON(http.StatusOK, updatedIncome)
}

// DELETE
func (i *incomeController) DeleteIncome(c echo.Context) error {
	ctx := c.Request().Context()
	incomeID := c.Param("id")
	if incomeID == "" {
		return c.JSON(http.StatusBadRequest, "income ID is required")
	}

	if err := i.u.DeleteIncome(ctx, incomeID); err != nil {
		return c.JSON(http.StatusInternalServerError, "failed to delete income")
	}
	return c.JSON(http.StatusOK, "ok")
}

type (
	Income = generated.Income
)
