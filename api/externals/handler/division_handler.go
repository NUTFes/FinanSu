package handler

import (
	"net/http"
	"strconv"

	"github.com/NUTFes/FinanSu/api/generated"
	"github.com/labstack/echo/v4"
)

// router.GET(baseURL+"/divisions", wrapper.GetDivisions)
func (h *Handler) GetDivisions(c echo.Context, params generated.GetDivisionsParams) error {
	ctx := c.Request().Context()
	year := strconv.Itoa(*params.Year)
	financialRecordId := strconv.Itoa(*params.FinancialRecordId)

	divisionDetails, err := h.divisionUseCase.GetDivisions(ctx, year, financialRecordId)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, divisionDetails)
}

// router.POST(baseURL+"/divisions", wrapper.PostDivisions)
func (h *Handler) PostDivisions(c echo.Context) error {
	ctx := c.Request().Context()
	division := new(Division)

	if err := c.Bind(division); err != nil {
		return c.String(http.StatusBadRequest, "Bad Request")
	}
	latestDivision, err := h.divisionUseCase.CreateDivision(ctx, *division)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, latestDivision)
}

// router.GET(baseURL+"/divisions/:id", wrapper.GetDivisionsId)
func (h *Handler) GetDivisionsId(c echo.Context, id int) error {
	ctx := c.Request().Context()
	division, err := h.divisionUseCase.GetDivision(ctx, strconv.Itoa(id))
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, division)
}

// router.DELETE(baseURL+"/divisions/:id", wrapper.DeleteDivisionsId)
func (h *Handler) DeleteDivisionsId(c echo.Context, id int) error {
	ctx := c.Request().Context()
	idStr := strconv.Itoa(id)
	err := h.divisionUseCase.DestroyDivision(ctx, idStr)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Destroy Division")
}

// router.PUT(baseURL+"/divisions/:id", wrapper.PutDivisionsId)
func (h *Handler) PutDivisionsId(c echo.Context, id int) error {
	ctx := c.Request().Context()
	idStr := strconv.Itoa(id)
	division := new(Division)

	if err := c.Bind(division); err != nil {
		return c.String(http.StatusBadRequest, "Bad Request")
	}
	updatedDivision, err := h.divisionUseCase.UpdateDivision(ctx, idStr, *division)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, updatedDivision)
}

// GetDivisionsUsers
func (h *Handler) GetDivisionsUsers(c echo.Context, params generated.GetDivisionsUsersParams) error {
	ctx := c.Request().Context()

	divisionOptions, err := h.divisionUseCase.GetDivisionOptions(ctx, strconv.Itoa(*params.Year), strconv.Itoa(params.UserId))
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, divisionOptions)
}

// GetDivisionsYears
func (h *Handler) GetDivisionsYears(c echo.Context, params generated.GetDivisionsYearsParams) error {
	ctx := c.Request().Context()

	// Retrieve division options for each year from the usecase layer.
	divisions, err := h.divisionUseCase.GetDivisionsYears(ctx, strconv.Itoa(*params.Year))
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, divisions)
}

type (
	Division        = generated.Division
	DivisionDetails = generated.DivisionDetails
)
