package controller

import (
	"net/http"

	"github.com/NUTFes/FinanSu/api/generated"
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
	financialRecord := new(generated.FinancialRecord)
	if err := c.Bind(financialRecord); err != nil {
		return c.String(http.StatusBadRequest, "Bad Request")
	}
	latastFinancialRecord, err := f.u.CreateFinancialRecord(c.Request().Context(), *financialRecord)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, latastFinancialRecord)
}

func (f *financialRecordController) UpdateFinancialRecord(c echo.Context) error {
	id := c.Param("id")
	financialRecord := new(generated.FinancialRecord)
	if err := c.Bind(financialRecord); err != nil {
		return c.String(http.StatusBadRequest, "Bad Request")
	}
	updatedFinancialRecord, err := f.u.UpdateFinancialRecord(
		c.Request().Context(),
		id,
		*financialRecord,
	)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, updatedFinancialRecord)
}

func (f *financialRecordController) DestroyFinancialRecord(c echo.Context) error {
	id := c.Param("id")
	err := f.u.DestroyFinancialRecord(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Destroy Bureau")
}
