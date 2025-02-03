package handler

import (
	"net/http"
	"strconv"

	"github.com/NUTFes/FinanSu/api/generated"
	"github.com/labstack/echo/v4"
)

// router.GET(baseURL+"/divisions", wrapper.GetDivisions)
func (h *Handler) GetDivisions(c echo.Context) error {
	ctx := c.Request().Context()
	year := c.QueryParam("year")
	financialRecordId := c.QueryParam("financial_record_id")

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
func (h *Handler) PutDivisionsId(c echo.Context) error {
	ctx := c.Request().Context()
	id := c.Param("id")
	division := new(Division)

	if err := c.Bind(division); err != nil {
		return c.String(http.StatusBadRequest, "Bad Request")
	}
	updatedDivision, err := h.divisionUseCase.UpdateDivision(ctx, id, *division)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, updatedDivision)
}

type (
	Division        = generated.Division
	DivisionDetails = generated.DivisionDetails
)
