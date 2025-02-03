package handler

import (
	"net/http"

	"github.com/NUTFes/FinanSu/api/generated"
	"github.com/labstack/echo/v4"
)

// router.GET(baseURL+"/financial_records", wrapper.GetFinancialRecords)
func (h *Handler) GetFinancialRecords(c echo.Context) error {
	financialRecordDetails, err := h.financialRecordUseCase.GetFinancialRecords(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, financialRecordDetails)
}

// router.POST(baseURL+"/financial_records", wrapper.PostFinancialRecords)
func (h *Handler) PostFinancialRecords(c echo.Context) error {
	financialRecord := new(FinancialRecord)
	if err := c.Bind(financialRecord); err != nil {
		return c.String(http.StatusBadRequest, "Bad Request")
	}

	latestFinancialRecord, err := h.financialRecordUseCase.CreateFinancialRecord(c.Request().Context(), *financialRecord)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, latestFinancialRecord)
}

// router.DELETE(baseURL+"/financial_records/:id", wrapper.DeleteFinancialRecordsId)
func (h *Handler) DeleteFinancialRecordsId(c echo.Context) error {
	id := c.Param("id")
	err := h.financialRecordUseCase.DestroyFinancialRecord(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Destroy FinancialRecord")
}

// router.PUT(baseURL+"/financial_records/:id", wrapper.PutFinancialRecordsId)
func (h *Handler) PutFinancialRecordsId(c echo.Context) error {
	id := c.Param("id")
	financialRecord := new(FinancialRecord)
	if err := c.Bind(financialRecord); err != nil {
		return c.String(http.StatusBadRequest, "Bad Request")
	}
	updatedFinancialRecord, err := h.financialRecordUseCase.UpdateFinancialRecord(
		c.Request().Context(),
		id,
		*financialRecord,
	)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, updatedFinancialRecord)
}

type FinancialRecordDetails = generated.FinancialRecordDetails
type FinancialRecord = generated.FinancialRecord
