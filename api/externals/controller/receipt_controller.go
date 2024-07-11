package controller

import (
	"fmt"
	"net/http"

	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/labstack/echo/v4"
)

type receiptController struct {
	u usecase.ReceiptUseCase
}

type ReceiptController interface {
	IndexReceipt(echo.Context) error
	ShowReceipt(echo.Context) error
	FindReceiptsByReportID(echo.Context) error
	CreateReceipt(echo.Context) error
	UpdateReceipt(echo.Context) error
	DestroyReceipt(echo.Context) error
}

func NewReceiptController(u usecase.ReceiptUseCase) ReceiptController {
	return &receiptController{u}
}

func (r *receiptController) IndexReceipt(c echo.Context) error {
	receipts, err := r.u.GetAllReceipts(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, receipts)
}

func (r *receiptController) ShowReceipt(c echo.Context) error {
	id := c.Param("id")
	receipt, err := r.u.GetReceiptByID(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, receipt)
}

func (r *receiptController) FindReceiptsByReportID(c echo.Context) error {
	id := c.Param("id")
	receipts, err := r.u.GetReceiptByPurchaseReportID(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, receipts)
}


func (r *receiptController) CreateReceipt(c echo.Context) error {
	var receipt domain.Receipt
	if err := c.Bind(&receipt); err != nil {
		fmt.Println("err")
		return err
	}
	latestReceipt, err := r.u.CreateReceipt(c.Request().Context(), receipt)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, latestReceipt)
}

func (r *receiptController) UpdateReceipt(c echo.Context) error {
	id := c.Param("id")
	var receipt domain.Receipt
	if err := c.Bind(&receipt); err != nil {
		fmt.Println("err")
		return err
	}
	updatedReceipt, err := r.u.UpdateReceipt(c.Request().Context(), id, receipt)

	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, updatedReceipt)
}

func (r *receiptController) DestroyReceipt(c echo.Context) error {
	id := c.Param("id")
	err := r.u.DestroyReceipt(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Destroy Receipt")
}
