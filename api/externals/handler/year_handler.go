package handler

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/NUTFes/FinanSu/api/generated"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/labstack/echo/v4"
)

const Layout = "2006-01-02 15:04:05"

// router.GET(baseURL+"/years", wrapper.GetYears)
func (h *Handler) GetYears(c echo.Context) error {
	years, err := h.yearUseCase.GetYears(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, years)
}

// router.POST(baseURL+"/years", wrapper.PostYears)
func (h *Handler) PostYears(c echo.Context, params generated.PostYearsParams) error {
	year := strconv.Itoa(params.Year)
	latestYear, err := h.yearUseCase.CreateYear(c.Request().Context(), year)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusCreated, latestYear)
}

// router.GET(baseURL+"/years/periods", wrapper.GetYearsPeriods)
func (h *Handler) GetYearsPeriods(c echo.Context) error {
	years, err := h.yearUseCase.GetYearPeriods(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, years)
}

// router.POST(baseURL+"/years/periods", wrapper.PostYearsPeriods)
func (h *Handler) PostYearsPeriods(c echo.Context) error {
	yearPeriod := new(domain.YearPeriod)
	if err := c.Bind(yearPeriod); err != nil {
		fmt.Println("err")
		return err
	}
	latestYearPeriod, err := h.yearUseCase.CreateYearPeriod(c.Request().Context(), strconv.Itoa(yearPeriod.Year), yearPeriod.StartedAt.Format(Layout), yearPeriod.EndedAt.Format(Layout))
	if err != nil {
		return err
	}
	return c.JSON(http.StatusCreated, latestYearPeriod)
}

// router.DELETE(baseURL+"/years/periods/:id", wrapper.DeleteYearsPeriodsId)
func (h *Handler) DeleteYearsPeriodsId(c echo.Context, id int) error {
	idStr := strconv.Itoa(id)
	err := h.yearUseCase.DestroyYearPeriod(c.Request().Context(), idStr)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Destroy Year Records")
}

// router.PUT(baseURL+"/years/periods/:id", wrapper.PutYearsPeriodsId)
func (h *Handler) PutYearsPeriodsId(c echo.Context, id int) error {
	idStr := strconv.Itoa(id)
	yearPeriod := new(domain.YearPeriod)
	if err := c.Bind(yearPeriod); err != nil {
		fmt.Println("err")
		return err
	}
	updateYearPeriod, err := h.yearUseCase.UpdateYearPeriod(c.Request().Context(), idStr, strconv.Itoa(yearPeriod.Year), yearPeriod.StartedAt.Format(Layout), yearPeriod.EndedAt.Format(Layout))
	if err != nil {
		return err
	}
	return c.JSON(http.StatusCreated, updateYearPeriod)
}

// router.DELETE(baseURL+"/years/:id", wrapper.DeleteYearsId)
func (h *Handler) DeleteYearsId(c echo.Context, id int) error {
	idStr := strconv.Itoa(id)
	err := h.yearUseCase.DestroyYear(c.Request().Context(), idStr)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Destroy Year")
}

// router.GET(baseURL+"/years/:id", wrapper.GetYearsId)
func (h *Handler) GetYearsId(c echo.Context, id int) error {
	idStr := strconv.Itoa(id)
	year, err := h.yearUseCase.GetYearByID(c.Request().Context(), idStr)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, year)
}

// router.PUT(baseURL+"/years/:id", wrapper.PutYearsId)
func (h *Handler) PutYearsId(c echo.Context, id int, params generated.PutYearsIdParams) error {
	idStr := strconv.Itoa(id)
	year := strconv.Itoa(params.Year)
	updatedYear, err := h.yearUseCase.UpdateYear(c.Request().Context(), idStr, year)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, updatedYear)
}
