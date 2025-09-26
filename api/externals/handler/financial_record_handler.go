package handler

import (
	"encoding/csv"
	"fmt"
	"net/http"
	"strconv"

	"github.com/NUTFes/FinanSu/api/generated"
	"github.com/labstack/echo/v4"
	"golang.org/x/text/encoding/japanese"
	"golang.org/x/text/transform"
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

// GetFinancialRecordsId
func (h *Handler) GetFinancialRecordsId(c echo.Context, id int) error {
	idStr := strconv.Itoa(id)
	financialRecord, err := h.financialRecordUseCase.GetFinancialRecord(c.Request().Context(), idStr)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, financialRecord)
}

// GetFinancialRecordsCsvDownload(ctx echo.Context, params GetFinancialRecordsCsvDownloadParams) error
func (h *Handler) GetFinancialRecordsCsvDownload(c echo.Context, params generated.GetFinancialRecordsCsvDownloadParams) error {
	var err error
	year := strconv.Itoa(params.Year)
	records, err := h.financialRecordUseCase.GetFinancialRecordDetailForCSV(c.Request().Context(), year)
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
	// Shift_JISエンコーディング用の変換を設定
	encoder := japanese.ShiftJIS.NewEncoder()

	// writerに対してエンコーダを設定して変換する
	shiftJISWriter := transform.NewWriter(writer, encoder)

	// CSVライターを作成
	csvWriter := csv.NewWriter(shiftJISWriter)

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
