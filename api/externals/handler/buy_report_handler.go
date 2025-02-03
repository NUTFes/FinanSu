package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/NUTFes/FinanSu/api/generated"
	"github.com/labstack/echo/v4"
)

// router.PUT(baseURL+"/buy_report/status/:buy_report_id", wrapper.PutBuyReportStatusBuyReportId)
func (h *Handler) PutBuyReportStatusBuyReportId(c echo.Context) error {
	// 未実装
	return c.String(http.StatusNotImplemented, "PutBuyReportStatusBuyReportId is not implemented")
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
func (h *Handler) GetBuyReportsDetails(c echo.Context) error {
	//未実装
	return c.String(http.StatusNotImplemented, "GetBuyReportsDetails is not implemented")
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
func (h *Handler) PutBuyReportsId(c echo.Context) error {
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

	buyReportInfo, err = h.buyReportUseCase.UpdateBuyReport(ctx, id, buyReportInfo, file)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, buyReportInfo)
}

type BuyReport = generated.BuyReport
