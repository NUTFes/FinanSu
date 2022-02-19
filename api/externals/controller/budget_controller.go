package controller

import (
	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/labstack/echo/v4"
	"net/http"
)

type budgetController struct {
	u usecase.BudgetUseCase
}

type BudgetController interface {
	IndexBudget(echo.Context) error
	ShowBudget(echo.Context) error
	CreateBudget(echo.Context) error
	UpdateBudget(echo.Context) error
	DestroyBudget(echo.Context) error
}

func NewBudgetController(u usecase.BudgetUseCase) BudgetController {
	return &budgetController{u}
}

// Index
func (b *budgetController) IndexBudget(c echo.Context) error {
	budgets, err := b.u.GetBudgets(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, budgets)
}

// Show
func (b budgetController) ShowBudget(c echo.Context) error {
	id := c.Param("id")
	budget, err := b.u.GetBudgetByID(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, budget)
}

// Create
func (b *budgetController) CreateBudget(c echo.Context) error {
	price := c.QueryParam("price")
	yearID := c.QueryParam("year_id")
	sourceID := c.QueryParam("source_id")
	err := b.u.CreateBudget(c.Request().Context(), price, yearID, sourceID)
	if err != nil {
		return err
	}
	return c.String(http.StatusCreated, "Created Budget")
}

// Update
func (b *budgetController) UpdateBudget(c echo.Context) error {
	id := c.Param("id")
	price := c.QueryParam("price")
	yearID := c.QueryParam("year_id")
	sourceID := c.QueryParam("source_id")
	err := b.u.UpdateBudget(c.Request().Context(), id, price, yearID, sourceID)
	if err != nil {
		return err
	}
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Updated Budget")
}

// Destroy
func (b *budgetController) DestroyBudget(c echo.Context) error {
	id := c.Param("id")
	err := b.u.DestroyBudget(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Destroy Budget")
}
