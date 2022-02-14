package controller

import (
	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/labstack/echo/v4"
	"net/http"
)

// Index
func IndexBudget(c echo.Context) error {
	budgets, err := usecase.GetBudgets()
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, budgets)
}

// Show
func ShowBudget(c echo.Context) error {
	id := c.Param("id")
	budget, err := usecase.GetBudgetByID(id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, budget)
}

// Create
func CreateBudget(c echo.Context) error {
	price := c.QueryParam("price")
	yearID := c.QueryParam("year_id")
	sourceID := c.QueryParam("source_id")
	err := usecase.CreateBudget(price, yearID, sourceID)
	if err != nil {
		return err
	}
	return c.String(http.StatusCreated, "Created Budget")
}

// Update
func UpdateBudget(c echo.Context) error {
	id := c.Param("id")
	price := c.QueryParam("price")
	yearID := c.QueryParam("year_id")
	sourceID := c.QueryParam("source_id")
	err := usecase.UpdateBudget(id, price, yearID, sourceID)
	if err != nil {
		return err
	}
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Updated Budget")
}

// Destroy
func DestroyBudget(c echo.Context) error {
	id := c.Param("id")
	err := usecase.DestroyBudget(id)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Destroy Budget")
}
