package controller

import (
	"net/http"

	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/labstack/echo/v4"
)

type financialRecordController struct {
	u usecase.FinancialRecordUseCase
}

type FinancialRecordController interface {
	IndexFinancialRecords(echo.Context) error
	CreateFinancialRecord(echo.Context) error
	UpdateFinancialRecord(echo.Context) error
	DestroyFinancialRecord(echo.Context) error
}

func NewFinancialRecordController(u usecase.FinancialRecordUseCase) FinancialRecordController {
	return &financialRecordController{u}
}

func (f *financialRecordController) IndexFinancialRecords(c echo.Context) error {
	bureaus, err := f.u.GetFinancialRecords(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, bureaus)
}

func (f *financialRecordController) CreateFinancialRecord(c echo.Context) error {
	name := c.QueryParam("name")

	latastBureau, err := f.u.CreateFinancialRecord(c.Request().Context(), name)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, latastBureau)
}

func (f *financialRecordController) UpdateFinancialRecord(c echo.Context) error {
	id := c.Param("id")
	name := c.QueryParam("name")

	updatedBureau, err := f.u.UpdateFinancialRecord(c.Request().Context(), id, name)

	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, updatedBureau)
}

func (f *financialRecordController) DestroyFinancialRecord(c echo.Context) error {
	id := c.Param("id")
	err := f.u.DestroyFinancialRecord(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Destroy Bureau")
}
