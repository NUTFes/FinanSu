package controller

import (
	"fmt"
	"net/http"

	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/labstack/echo/v4"
)

type buyReportController struct {
	u usecase.BuyReportUseCase
}

type BuyReportController interface {
	IndexBuyReport(echo.Context) error
}

func NewBuyReportController(u usecase.BuyReportUseCase) BuyReportController {
	return &buyReportController{u}
}

// Index
func (s *buyReportController) IndexBuyReport(c echo.Context) error {
	fmt.Println("IndexBuyReport")
	sources, err := s.u.GetBuyReports(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, sources)
}
