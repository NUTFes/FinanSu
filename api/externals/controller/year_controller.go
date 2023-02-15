package controller

import (
	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/labstack/echo/v4"
	"net/http"
)

type yearController struct {
	u usecase.YearUseCase
}

type YearController interface {
	IndexYear(echo.Context) error
	ShowYear(echo.Context) error
	CreateYear(echo.Context) error
	UpdateYear(echo.Context) error
	DestroyYear(echo.Context) error
}

func NewYearController(u usecase.YearUseCase) YearController {
	return &yearController{u}
}

// Index
func (y *yearController) IndexYear(c echo.Context) error {
	years, err := y.u.GetYears(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, years)
}

// Show
func (y *yearController) ShowYear(c echo.Context) error {
	id := c.Param("id")
	year, err := y.u.GetYearByID(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, year)
}

// Create
func (y *yearController) CreateYear(c echo.Context) error {
	year := c.QueryParam("year")
	latestYear, err := y.u.CreateYear(c.Request().Context(), year)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusCreated, latestYear)
}

// Update
func (y *yearController) UpdateYear(c echo.Context) error {
	id := c.Param("id")
	year := c.QueryParam("year")
	updatedYear, err := y.u.UpdateYear(c.Request().Context(), id, year)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, updatedYear)
}

// Destroy
func (y *yearController) DestroyYear(c echo.Context) error {
	id := c.Param("id")
	err := y.u.DestroyYear(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Destroy Year")
}
