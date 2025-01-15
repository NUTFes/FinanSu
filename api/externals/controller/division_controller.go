package controller

import (
	"net/http"

	"github.com/NUTFes/FinanSu/api/generated"
	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/labstack/echo/v4"
)

type divisionController struct {
	u usecase.DivisionUseCase
}

type DivisionController interface {
	IndexDivisions(echo.Context) error
	CreateDivision(echo.Context) error
	UpdateDivision(echo.Context) error
	DestroyDivision(echo.Context) error
}

func NewDivisionController(u usecase.DivisionUseCase) DivisionController {
	return &divisionController{u}
}

func (d *divisionController) IndexDivisions(c echo.Context) error {
	ctx := c.Request().Context()
	year := c.QueryParam("year")
	financialRecordId := c.QueryParam("financial_record_id")
	var divisionDetails DivisionDetails

	divisionDetails, err := d.u.GetDivisions(ctx, year, financialRecordId)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, divisionDetails)
}

func (d *divisionController) CreateDivision(c echo.Context) error {
	ctx := c.Request().Context()
	division := new(Division)

	if err := c.Bind(division); err != nil {
		return c.String(http.StatusBadRequest, "Bad Request")
	}
	latestDivision, err := d.u.CreateDivision(ctx, *division)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, latestDivision)
}

func (d *divisionController) UpdateDivision(c echo.Context) error {
	ctx := c.Request().Context()
	id := c.Param("id")
	division := new(Division)

	if err := c.Bind(division); err != nil {
		return c.String(http.StatusBadRequest, "Bad Request")
	}
	updatedDivision, err := d.u.UpdateDivision(ctx, id, *division)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, updatedDivision)
}

func (d *divisionController) DestroyDivision(c echo.Context) error {
	ctx := c.Request().Context()
	id := c.Param("id")

	err := d.u.DestroyDivision(ctx, id)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Destroy Division")
}

type (
	Division        = generated.Division
	DivisionDetails = generated.DivisionDetails
)
