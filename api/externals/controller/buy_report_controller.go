package controller

import (
	"encoding/json"
	"net/http"

	"github.com/NUTFes/FinanSu/api/generated"
	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/labstack/echo/v4"
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

type BuyReport = generated.BuyReport
type BuyReportDetails = []generated.BuyReportDetail
type BuyReportStatusRequestBody = generated.PutBuyReportStatusBuyReportIdJSONRequestBody
