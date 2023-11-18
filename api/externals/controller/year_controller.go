package controller

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/labstack/echo/v4"
)

type yearController struct {
	u usecase.YearUseCase
}

const Layout = "2006-01-02 15:04:05"

type YearController interface {
	IndexYear(echo.Context) error
	ShowYear(echo.Context) error
	CreateYear(echo.Context) error
	UpdateYear(echo.Context) error
	DestroyYear(echo.Context) error
	IndexYearPeriods(echo.Context) error
	CreateYearPeriod(echo.Context) error
	UpdateYearPeriod(echo.Context) error
	DestroyYearRecords(echo.Context) error
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

func (y *yearController) IndexYearPeriods(c echo.Context) error {
	years, err := y.u.GetYearPeriods(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, years)
}

func (y *yearController) CreateYearPeriod(c echo.Context) error {
	yearPeriod := new(domain.YearPeriod)
	if err := c.Bind(yearPeriod); err != nil {
		fmt.Println("err")
		return err
	}
	latestYearPeriod, err := y.u.CreateYearPeriod(c.Request().Context(), strconv.Itoa(yearPeriod.Year), yearPeriod.StartedAt.Format(Layout), yearPeriod.EndedAt.Format(Layout))
	if err != nil {
		return err
	}
	return c.JSON(http.StatusCreated, latestYearPeriod)
}

func (y *yearController) UpdateYearPeriod(c echo.Context) error {
	id := c.Param("id")
	print(id)
	yearPeriod := new(domain.YearPeriod)
	if err := c.Bind(yearPeriod); err != nil {
		fmt.Println("err")
		return err
	}
	updateYearPeriod, err := y.u.UpdateYearPeriod(c.Request().Context(), id , strconv.Itoa(yearPeriod.Year), yearPeriod.StartedAt.Format(Layout), yearPeriod.EndedAt.Format(Layout))
	if err != nil {
		return err
	}
	return c.JSON(http.StatusCreated, updateYearPeriod)
}

func (y *yearController) DestroyYearRecords(c echo.Context) error {
	id := c.Param("id")
	err := y.u.DestroyYearRecords(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Destroy Year Records")
}
