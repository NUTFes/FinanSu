package controller

import (
	"net/http"

	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/labstack/echo/v4"
)

type expenseController struct {
	u usecase.ExpenseUseCase
}

type ExpenseController interface {
	IndexExpense(echo.Context) error
	ShowExpense(echo.Context) error
	CreateExpense(echo.Context) error
	UpdateExpense(echo.Context) error
	DestroyExpense(echo.Context) error
	UpdateExpenseTP(echo.Context) error
	IndexExpenseDetails(echo.Context) error
	ShowExpenseDetail(echo.Context) error
	IndexExpenseDetailsByPeriod(echo.Context) error
}

func NewExpenseController(u usecase.ExpenseUseCase) ExpenseController {
	return &expenseController{u}
}

func (e *expenseController) IndexExpense(c echo.Context) error {
	err := e.u.UpdateExpenseTP(c.Request().Context())
	if err != nil {
		return err
	}
	expenses, err := e.u.GetExpenses(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, expenses)
}

func (e *expenseController) ShowExpense(c echo.Context) error {
	id := c.Param("id")
	expense, err := e.u.GetExpenseByID(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, expense)
}

func (e *expenseController) CreateExpense(c echo.Context) error {
	name := c.QueryParam("name")
	yearID := c.QueryParam("year_id")
	latastExpense, err := e.u.CreateExpense(c.Request().Context(), name, yearID)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusCreated, latastExpense)
}

func (e *expenseController) UpdateExpense(c echo.Context) error {
	id := c.Param("id")
	name := c.QueryParam("name")
	yearID := c.QueryParam("year_id")
	updatedExpense, err := e.u.UpdateExpense(c.Request().Context(), id, name, yearID)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, updatedExpense)
}

func (e *expenseController) DestroyExpense(c echo.Context) error {
	id := c.Param("id")
	err := e.u.DestroyExpense(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Destroy Expense")
}

func (e *expenseController) UpdateExpenseTP(c echo.Context) error {
	err := e.u.UpdateExpenseTP(c.Request().Context())
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Updated Expense's totalPrice")
}

func (e *expenseController) IndexExpenseDetails(c echo.Context) error {
	err := e.u.UpdateExpenseTP(c.Request().Context())
	if err != nil {
		return err
	}
	expenseDetails, err := e.u.GetExpenseDetails(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, expenseDetails)
}

func (e *expenseController) ShowExpenseDetail(c echo.Context) error {
	id := c.Param("id")
	expenseDetail, err := e.u.GetExpenseDetailByID(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, expenseDetail)
}

func (e *expenseController) IndexExpenseDetailsByPeriod(c echo.Context) error {
	year := c.Param("year")
	err := e.u.UpdateExpenseTP(c.Request().Context())
	if err != nil {
		return err
	}
	expenseDetails, err := e.u.GetExpenseDetailsByPeriod(c.Request().Context(), year)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, expenseDetails)
}
