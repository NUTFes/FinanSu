package controllers

import (
	"github.com/NUTFes/finansu/api/internal/usecases"
	// "github.com/NUTFes/finansu/api/internal/entities/budget"
	"github.com/labstack/echo/v4"
	"net/http"
)

type budgetController struct {
	budgetUseCase usecases.BudgetUseCase
}

type BudgetController interface {
	GetBudgets(c echo.Context) error
	GetBudgetByID(c echo.Context) error
	CreateBudget(c echo.Context) error
	UpdateBudget(c echo.Context) error
	DestroyBudget(c echo.Context) error
}

func NewBudgetController(usecase usecases.BudgetUseCase) BudgetController {
	return &budgetController{budgetUseCase: usecase}
}

func (budgetController *budgetController) GetBudgets(c echo.Context) error {
	return c.String(http.StatusOK, "Budget Index")
}

func (budgetController *budgetController) GetBudgetByID(c echo.Context) error {
	return c.String(http.StatusOK, "Budget Show")
}

func (budgetController *budgetController) CreateBudget(c echo.Context) error {
	return c.String(http.StatusOK, "Budget Create")
}

func (budgetController *budgetController) UpdateBudget(c echo.Context) error {
	return c.String(http.StatusOK, "Budget Update")
}

func (budgetController *budgetController) DestroyBudget(c echo.Context) error {
	return c.String(http.StatusOK, "Budget Destroy")
}
