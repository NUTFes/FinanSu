package controller

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/NUTFes/FinanSu/api/generated"
	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/labstack/echo/v4"
	"golang.org/x/text/encoding/japanese"
	"golang.org/x/text/transform"
)

type buyReportController struct {
	u usecase.BuyReportUseCase
}

type BuyReportController interface {
	CreateBuyReport(echo.Context) error
	UpdateBuyReport(echo.Context) error
	DeleteBuyReport(echo.Context) error
	IndexBuyReport(echo.Context) error
	GetBuyReportById(echo.Context) error
	UpdateBuyReportStatus(echo.Context) error
	GetBuyReportsCsvDownload(echo.Context) error
}

func NewBuyReportController(u usecase.BuyReportUseCase) BuyReportController {
	return &buyReportController{u}
}

// Create
func (s *buyReportController) CreateBuyReport(c echo.Context) error {
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

	buyReport, err := s.u.CreateBuyReport(ctx, buyReportInfo, file)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, buyReport)
}

// Update
func (s *buyReportController) UpdateBuyReport(c echo.Context) error {
	ctx := c.Request().Context()
	id := c.Param("id")
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

	buyReportInfo, err = s.u.UpdateBuyReport(ctx, id, buyReportInfo, file)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, buyReportInfo)
}

// Delete
func (s *buyReportController) DeleteBuyReport(c echo.Context) error {
	ctx := c.Request().Context()
	id := c.Param("id")
	err := s.u.DeleteBuyReport(ctx, id)
	if err != nil {
		return c.String(http.StatusBadRequest, "buy_report delete failed")
	}
	return c.String(http.StatusOK, "buy_report delete success")
}

// Index
func (s *buyReportController) IndexBuyReport(c echo.Context) error {
	ctx := c.Request().Context()
	year := c.QueryParam("year")

	buyReportDetails, err := s.u.GetBuyReports(ctx, year)
	if err != nil {
		return c.String(http.StatusBadRequest, "failed to buy_reports")
	}

	return c.JSON(http.StatusOK, buyReportDetails)
}

// Get
func (s *buyReportController) GetBuyReportById(c echo.Context) error {
	ctx := c.Request().Context()
	id := c.Param("id")

	buyReportDetail, err := s.u.GetBuyReportById(ctx, id)
	if err != nil {
		return c.String(http.StatusBadRequest, "failed to buy_report")
	}

	return c.JSON(http.StatusOK, buyReportDetail)
}

// UpdateStatus
func (s *buyReportController) UpdateBuyReportStatus(c echo.Context) error {
	ctx := c.Request().Context()
	buyReportId := c.Param("buy_report_id")
	var requestBody BuyReportStatusRequestBody
	if err := c.Bind(&requestBody); err != nil {
		return c.String(http.StatusBadRequest, "Bad Request")
	}

	buyReportDetail, err := s.u.UpdateBuyReportStatus(ctx, buyReportId, requestBody)
	if err != nil {
		return c.String(http.StatusBadRequest, "failed update buy_reports")
	}

	return c.JSON(http.StatusOK, buyReportDetail)
}

// GetBuyReportsCsvDownload
func (s *buyReportController) GetBuyReportsCsvDownload(c echo.Context) error {
	ctx := c.Request().Context()
	year := c.QueryParam("year")

	buyReportDetails, err := s.u.GetBuyReports(ctx, year)
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
	fileName := fmt.Sprintf("purchase_reports_%s.csv", year)
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

type BuyReport = generated.BuyReport
type BuyReportDetails = []generated.BuyReportDetail
type BuyReportStatusRequestBody = generated.PutBuyReportStatusBuyReportIdJSONRequestBody
