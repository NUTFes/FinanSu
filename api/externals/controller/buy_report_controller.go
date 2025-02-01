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

	sources, err := s.u.CreateBuyReport(ctx, buyReportInfo, file)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, sources)
}

type BuyReport = generated.BuyReport
