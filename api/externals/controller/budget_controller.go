package controller

import (
	"net/http"

	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/labstack/echo/v4"
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
	ShowBudgetDetailById(echo.Context) error
	ShowBudgetDetails(echo.Context) error
	ShowBudgetDetailsByPeriods(echo.Context) error
}

func NewBudgetController(u usecase.BudgetUseCase) BudgetController {
	return &budgetController{u}
}

func (b *budgetController) IndexBudget(c echo.Context) error {
	budgets, err := b.u.GetBudgets(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, budgets)
}

func (b *budgetController) ShowBudget(c echo.Context) error {
	id := c.Param("id")

	budget, err := b.u.GetBudgetByID(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, budget)
}

func (b *budgetController) CreateBudget(c echo.Context) error {
	price := c.QueryParam("price")
	yearID := c.QueryParam("year_id")
	sourceID := c.QueryParam("source_id")

	latastBudget, err := b.u.CreateBudget(c.Request().Context(), price, yearID, sourceID)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, latastBudget)
}

func (b *budgetController) UpdateBudget(c echo.Context) error {
	id := c.Param("id")
	price := c.QueryParam("price")
	yearID := c.QueryParam("year_id")
	sourceID := c.QueryParam("source_id")

	updatedBudget, err := b.u.UpdateBudget(c.Request().Context(), id, price, yearID, sourceID)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, updatedBudget)
}

func (b *budgetController) DestroyBudget(c echo.Context) error {
	id := c.Param("id")

	err := b.u.DestroyBudget(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Destroy Budget")
}

// IDを指定してBudgetに紐づくyearとsourceの取得
func (b *budgetController) ShowBudgetDetailById(c echo.Context) error {
	id := c.Param("id")

	budgetDetail, err := b.u.GetBudgetDetailByID(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, budgetDetail)
}

// Budgetに紐づくyearとsourceの全件取得
func (b *budgetController) ShowBudgetDetails(c echo.Context) error {
	budgetDetails, err := b.u.GetBudgetDetails(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, budgetDetails)
}

// 年度ごとにBudgetと紐づくデータ全件取得
func (b *budgetController) ShowBudgetDetailsByPeriods(c echo.Context) error {
	year := c.Param("year")
	budgetDetails, err := b.u.GetBudgetDetailsByPeriod(c.Request().Context(), year)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, budgetDetails)
}
