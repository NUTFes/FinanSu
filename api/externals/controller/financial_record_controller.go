package controller

import (
	"encoding/csv"
	"fmt"
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
	DownloadFinancialRecordsCSV(echo.Context) error
}

func NewFinancialRecordController(u usecase.FinancialRecordUseCase) FinancialRecordController {
	return &financialRecordController{u}
}

func (f *financialRecordController) IndexFinancialRecords(c echo.Context) error {
	year := c.QueryParam("year")
	var financialRecordDetails FinancialRecordDetails
	var err error

	if year != "" {
		financialRecordDetails, err = f.u.GetFinancialRecordsByYears(c.Request().Context(), year)
		if err != nil {
			return err
		}
		return c.JSON(http.StatusOK, financialRecordDetails)
	}

	financialRecordDetails, err = f.u.GetFinancialRecords(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, financialRecordDetails)
}

func (f *financialRecordController) CreateFinancialRecord(c echo.Context) error {
	financialRecord := new(FinancialRecord)
	if err := c.Bind(financialRecord); err != nil {
		return c.String(http.StatusBadRequest, "Bad Request")
	}
	latestFinancialRecord, err := f.u.CreateFinancialRecord(c.Request().Context(), *financialRecord)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, latestFinancialRecord)
}

func (f *financialRecordController) UpdateFinancialRecord(c echo.Context) error {
	id := c.Param("id")
	financialRecord := new(FinancialRecord)
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
	return c.String(http.StatusOK, "Destroy FinancialRecord")
}

func (f *financialRecordController) DownloadFinancialRecordsCSV(c echo.Context) error {
	year := c.QueryParam("year")
	var err error

	records, err := f.u.GetFinancialRecordDetailForCSV(c.Request().Context(), year)
	if err != nil {
		return err
	}

	// ヘッダーの設定
	w := c.Response().Writer
	fileName := fmt.Sprintf("予算_%s.csv", year)
	attachment := fmt.Sprintf(`attachment; filename="%s"`, fileName)
	w.Header().Set("Content-Type", "text/csv")
	w.Header().Set("Content-Disposition", attachment)

	if err := makeCSV(w, records); err != nil {
		return err
	}

	return nil
}

func makeCSV(writer http.ResponseWriter, records [][]string) error {
	csvWriter := csv.NewWriter(writer)
	for _, record := range records {
		if err := csvWriter.Write(record); err != nil {
			http.Error(writer, "CSVの書き込み中にエラーが発生しました", http.StatusInternalServerError)
			return err
		}
	}
	csvWriter.Flush()
	if err := csvWriter.Error(); err != nil {
		http.Error(writer, "CSVのフラッシュ中にエラーが発生しました", http.StatusInternalServerError)
		return err
	}
	return nil
}

type FinancialRecordDetails = generated.FinancialRecordDetails
type FinancialRecord = generated.FinancialRecord
