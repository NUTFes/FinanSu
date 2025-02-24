package handler

import (
	"net/http"
	"strconv"

	"github.com/NUTFes/FinanSu/api/generated"
	"github.com/labstack/echo/v4"
)

// router.GET(baseURL+"/financial_records", wrapper.GetFinancialRecords)
func (h *Handler) GetFinancialRecords(c echo.Context, params generated.GetFinancialRecordsParams) error {
	yearStr := strconv.Itoa(*params.Year)
	financialRecordDetails, err := h.financialRecordUseCase.GetFinancialRecordsByYears(c.Request().Context(), yearStr)
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
func (h *Handler) DeleteFinancialRecordsId(c echo.Context, id int) error {
	idStr := strconv.Itoa(id)
	err := h.financialRecordUseCase.DestroyFinancialRecord(c.Request().Context(), idStr)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Destroy FinancialRecord")
}

// router.PUT(baseURL+"/financial_records/:id", wrapper.PutFinancialRecordsId)
func (h *Handler) PutFinancialRecordsId(c echo.Context, id int) error {
	idStr := strconv.Itoa(id)
	financialRecord := new(FinancialRecord)
	if err := c.Bind(financialRecord); err != nil {
		return c.String(http.StatusBadRequest, "Bad Request")
	}
	updatedFinancialRecord, err := h.financialRecordUseCase.UpdateFinancialRecord(
		c.Request().Context(),
		idStr,
		*financialRecord,
	)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, updatedFinancialRecord)
}

type FinancialRecordDetails = generated.FinancialRecordDetails
type FinancialRecord = generated.FinancialRecord
