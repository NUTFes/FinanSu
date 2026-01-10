package handler

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/NUTFes/FinanSu/api/generated"
	"github.com/labstack/echo/v4"
	"golang.org/x/text/encoding/japanese"
	"golang.org/x/text/transform"
)

// router.PUT(baseURL+"/buy_report/status/:buy_report_id", wrapper.PutBuyReportStatusBuyReportId)
func (h *Handler) PutBuyReportStatusBuyReportId(c echo.Context, id int) error {
	ctx := c.Request().Context()
	buyReportId := strconv.Itoa(id)

	var requestBody generated.PutBuyReportStatusBuyReportIdJSONRequestBody
	if err := c.Bind(&requestBody); err != nil {
		return c.String(http.StatusBadRequest, "Bad Request")
	}

	buyReportDetail, err := h.buyReportUseCase.UpdateBuyReportStatus(ctx, buyReportId, requestBody)
	if err != nil {
		return c.String(http.StatusBadRequest, "failed update buy_reports")
	}

	return c.JSON(http.StatusOK, buyReportDetail)
}

// router.POST(baseURL+"/buy_reports", wrapper.PostBuyReports)
func (h *Handler) PostBuyReports(c echo.Context) error {
	ctx := c.Request().Context()
	// ファイル取得
	file, err := c.FormFile("file")
	if err != nil {
		return c.String(http.StatusBadRequest, "file not found")
	}
	// JSON データを取得
	buyReportStr := c.FormValue("buy_report")
	if buyReportStr == "" {
		return c.String(http.StatusBadRequest, "buy_report not found")
	}

	// jsonのパース
	var buyReportInfo BuyReport
	err = json.Unmarshal([]byte(buyReportStr), &buyReportInfo)
	if err != nil {
		return c.String(http.StatusBadRequest, "buy_report is not valid")
	}

	buyReport, err := h.buyReportUseCase.CreateBuyReport(ctx, buyReportInfo, file)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, buyReport)
}

// router.GET(baseURL+"/buy_reports/details", wrapper.GetBuyReportsDetails)
func (h *Handler) GetBuyReportsDetails(c echo.Context, params generated.GetBuyReportsDetailsParams) error {
	ctx := c.Request().Context()
	var yearStr string
	if params.Year != nil {
		yearStr = strconv.Itoa(*params.Year)
	}
	var financialRecordId string
	if params.FinancialRecordId != nil {
		financialRecordId = strconv.Itoa(*params.FinancialRecordId)
	}
	var PaidBy string
	if params.PaidBy != nil {
		PaidBy = *params.PaidBy
	}
	var PaidByUserId string
	if params.PaidByUserId != nil {
		PaidByUserId = strconv.Itoa(*params.PaidByUserId)
	}

	buyReportDetails, err := h.buyReportUseCase.GetBuyReports(ctx, yearStr, financialRecordId, PaidBy, PaidByUserId)
	if err != nil {
		return c.String(http.StatusBadRequest, "failed to buy_reports")
	}

	return c.JSON(http.StatusOK, buyReportDetails)
}

// router.DELETE(baseURL+"/buy_reports/:id", wrapper.DeleteBuyReportsId)
func (h *Handler) DeleteBuyReportsId(c echo.Context, id int) error {
	ctx := c.Request().Context()
	idStr := strconv.Itoa(id)
	err := h.buyReportUseCase.DeleteBuyReport(ctx, idStr)
	if err != nil {
		return c.String(http.StatusBadRequest, "buy_report delete failed")
	}
	return c.String(http.StatusOK, "buy_report delete success")
}

// router.PUT(baseURL+"/buy_reports/:id", wrapper.PutBuyReportsId)
func (h *Handler) PutBuyReportsId(c echo.Context, id int) error {
	ctx := c.Request().Context()
	idStr := strconv.Itoa(id)
	// ファイル取得
	file, _ := c.FormFile("file")
	// JSON データを取得
	buyReportStr := c.FormValue("buy_report")
	if buyReportStr == "" {
		return c.String(http.StatusBadRequest, "buy_report not found")
	}

	// jsonのパース
	var buyReportInfo BuyReport
	err := json.Unmarshal([]byte(buyReportStr), &buyReportInfo)
	if err != nil {
		return c.String(http.StatusBadRequest, "buy_report is not valid")
	}

	buyReportInfo, err = h.buyReportUseCase.UpdateBuyReport(ctx, idStr, buyReportInfo, file)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, buyReportInfo)
}

// router.GET(baseURL+"/buy_reports/:id", wrapper.GetBuyReportsId)
func (h *Handler) GetBuyReportsId(c echo.Context, id int) error {
	ctx := c.Request().Context()

	buyReportDetail, err := h.buyReportUseCase.GetBuyReportById(ctx, strconv.Itoa(id))
	if err != nil {
		return c.String(http.StatusBadRequest, "failed to buy_report")
	}

	return c.JSON(http.StatusOK, buyReportDetail)
}

// router.GET(baseURL+"/buy_reports/csv", wrapper.GetBuyReportsCsvDownload)
func (h *Handler) GetBuyReportsCsvDownload(c echo.Context, params generated.GetBuyReportsCsvDownloadParams) error {
	ctx := c.Request().Context()
	var yearStr string
	if params.Year != nil {
		yearStr = strconv.Itoa(*params.Year)
	}
	var financialRecordId string
	if params.FinancialRecordId != nil {
		financialRecordId = strconv.Itoa(*params.FinancialRecordId)
	}
	var PaidBy string
	if params.PaidBy != nil {
		PaidBy = *params.PaidBy
	}
	var PaidByUserId string
	if params.PaidByUserId != nil {
		PaidByUserId = strconv.Itoa(*params.PaidByUserId)
	}

	buyReportDetails, err := h.buyReportUseCase.GetBuyReports(ctx, yearStr, financialRecordId, PaidBy, PaidByUserId)
	if err != nil {
		return err
	}

	// CSVデータの準備
	records := make([][]string, 0, len(buyReportDetails)+1)

	// ヘッダー
	header := []string{"年度", "日付", "局名", "部門", "物品", "立替者", "金額", "封詰め", "清算完了"}
	records = append(records, header)

	// データ行を追加
	for _, detail := range buyReportDetails {
		yearStr := ""
		if detail.Year != nil {
			yearStr = strconv.Itoa(*detail.Year)
		}

		// 封詰めと清算完了のステータスを「未」「済」で表示
		packedStatus := "未"
		if detail.IsPacked {
			packedStatus = "済"
		}
		settledStatus := "未"
		if detail.IsSettled {
			settledStatus = "済"
		}

		reportDateStr := detail.ReportDate
		t, err := time.Parse(time.RFC3339, reportDateStr)
		if err == nil {
			reportDateStr = t.Format("2006年1月2日")
		}

		record := []string{
			yearStr,
			reportDateStr,
			detail.FinancialRecordName,
			detail.DivisionName,
			detail.FestivalItemName,
			detail.PaidBy,
			strconv.Itoa(detail.Amount),
			packedStatus,
			settledStatus,
		}
		records = append(records, record)
	}

	// ヘッダーの設定
	w := c.Response().Writer
	fileName := fmt.Sprintf("purchase_reports_%s.csv", yearStr)
	attachment := fmt.Sprintf(`attachment; filename="%s"`, fileName)
	w.Header().Set("Content-Type", "text/csv")
	w.Header().Set("Content-Disposition", attachment)

	if err := makeBuyReportCSV(w, records); err != nil {
		return err
	}

	return nil
}

func makeBuyReportCSV(writer http.ResponseWriter, records [][]string) error {
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

// router.GET(baseURL+"/buy_reports/summary", wrapper.GetBuyReportsSummary)
func (h *Handler) GetBuyReportsSummary(c echo.Context, params generated.GetBuyReportsSummaryParams) error {
	ctx := c.Request().Context()
	year := strconv.Itoa(params.Year)
	if year == "" {
		return c.String(http.StatusBadRequest, "year is required")
	}
	var financialRecordId string
	if params.FinancialRecordId != nil {
		financialRecordId = strconv.Itoa(*params.FinancialRecordId)
	}
	var PaidBy string
	if params.PaidBy != nil {
		PaidBy = *params.PaidBy
	}
	var PaidByUserId string
	if params.PaidByUserId != nil {
		PaidByUserId = strconv.Itoa(*params.PaidByUserId)
	}

	summary, err := h.buyReportUseCase.GetBuyReportsSummary(ctx, year, financialRecordId, PaidBy, PaidByUserId)
	if err != nil {
		c.Logger().Errorf("failed to get buy_reports summary: %v", err)
		return c.String(http.StatusInternalServerError, "failed to get buy_reports summary")
	}

	return c.JSON(http.StatusOK, summary)
}

type BuyReport = generated.BuyReport
