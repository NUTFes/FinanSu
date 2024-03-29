package controller

import (
	"net/http"
	"strconv"

	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/labstack/echo/v4"
)

type purchaseReportController struct {
	u usecase.PurchaseReportUseCase
}

type PurchaseReportController interface {
	IndexPurchaseReport(echo.Context) error
	ShowPurchaseReport(echo.Context) error
	CreatePurchaseReport(echo.Context) error
	UpdatePurchaseReport(echo.Context) error
	DestroyPurchaseReport(echo.Context) error
	IndexPurchaseReportDetails(echo.Context) error
	ShowPurchaseReportDetail(echo.Context) error
	IndexPurchaseReportDetailsByYear(echo.Context) error
}

func NewPurchaseReportController(u usecase.PurchaseReportUseCase) PurchaseReportController {
	return &purchaseReportController{u}
}

// Index
func (p *purchaseReportController) IndexPurchaseReport(c echo.Context) error {
	purchaseReports, err := p.u.GetPurchaseReports(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, purchaseReports)
}

// show
func (p *purchaseReportController) ShowPurchaseReport(c echo.Context) error {
	id := c.Param("id")
	purchaseReport, err := p.u.GetPurchaseReportByID(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, purchaseReport)
}

// Create
func (p *purchaseReportController) CreatePurchaseReport(c echo.Context) error {
	report := new(domain.PurchaseReport)
	if err := c.Bind(report); err != nil {
		return err
	}
	latastPurchaseReport, err := p.u.CreatePurchaseReport(c.Request().Context(), strconv.Itoa(report.UserID), strconv.Itoa(report.Discount), strconv.Itoa(report.Addition), strconv.FormatBool(report.FinanceCheck), strconv.Itoa(report.PurchaseOrderID), report.Remark, report.Buyer)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, latastPurchaseReport)
}

// Update
func (p *purchaseReportController) UpdatePurchaseReport(c echo.Context) error {
	id := c.Param("id")
	report := new(domain.PurchaseReport)
	if err := c.Bind(report); err != nil {
		return err
	}
	updatedPurchaseReport, err := p.u.UpdatePurchaseReport(c.Request().Context(), id, strconv.Itoa(report.UserID), strconv.Itoa(report.Discount), strconv.Itoa(report.Addition), strconv.FormatBool(report.FinanceCheck), strconv.Itoa(report.PurchaseOrderID), report.Remark, report.Buyer)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, updatedPurchaseReport)
}

// Destory
func (p *purchaseReportController) DestroyPurchaseReport(c echo.Context) error {
	id := c.Param("id")
	err := p.u.DestroyPurchaseReport(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Destory PurchaseReport")
}

func (p *purchaseReportController) IndexPurchaseReportDetails(c echo.Context) error {
	purchaseReportDetails, err := p.u.GetPurchaseReportDetails(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, purchaseReportDetails)
}

func (p *purchaseReportController) ShowPurchaseReportDetail(c echo.Context) error {
	id := c.Param("id")
	purchaseReportDetail, err := p.u.GetPurchaseReportDetailByID(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, purchaseReportDetail)
}

func (p *purchaseReportController) IndexPurchaseReportDetailsByYear(c echo.Context) error {
	year := c.Param("year")
	purchaseReportDetails, err := p.u.GetPurchaseReportDetailsByYear(c.Request().Context(), year)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, purchaseReportDetails)
}
