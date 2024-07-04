package controller

import (
	"net/http"

	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/labstack/echo/v4"
)

type purchaseOrderController struct {
	u usecase.PurchaseOrderUseCase
}

type PurchaseOrderController interface {
	IndexPurchaseOrder(echo.Context) error
	ShowPurchaseOrder(echo.Context) error
	CreatePurchaseOrder(echo.Context) error
	UpdatePurchaseOrder(echo.Context) error
	DestroyPurchaseOrder(echo.Context) error
	IndexOrderDetail(echo.Context) error
	ShowOrderDetail(echo.Context) error
	IndexOrderDetailByYear(echo.Context) error
	IndexUnregisteredOrderDetailByYear(echo.Context) error
}

func NewPurchaseOrderController(u usecase.PurchaseOrderUseCase) PurchaseOrderController {
	return &purchaseOrderController{u}
}

// Index
func (p *purchaseOrderController) IndexPurchaseOrder(c echo.Context) error {
	purchaseOrders, err := p.u.GetPurchaseOrders(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, purchaseOrders)
}

// show
func (p *purchaseOrderController) ShowPurchaseOrder(c echo.Context) error {
	id := c.Param("id")
	purchaseOrder, err := p.u.GetPurchaseOrderByID(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, purchaseOrder)
}

// Create
func (p *purchaseOrderController) CreatePurchaseOrder(c echo.Context) error {
	deadLine := c.QueryParam("deadline")
	userID := c.QueryParam("user_id")
	expenseID := c.QueryParam("expense_id")
	financeCheck := c.QueryParam("finance_check")
	purchaseOrder, err := p.u.CreatePurchaseOrder(c.Request().Context(), deadLine, userID, expenseID, financeCheck)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, purchaseOrder)
}

// Update
func (p *purchaseOrderController) UpdatePurchaseOrder(c echo.Context) error {
	id := c.Param("id")
	deadLine := c.QueryParam("deadline")
	userID := c.QueryParam("user_id")
	expenseID := c.QueryParam("expense_id")
	financeCheck := c.QueryParam("finance_check")

	purchaseOrder, err := p.u.UpdatePurchaseOrder(c.Request().Context(), id, deadLine, userID, expenseID, financeCheck)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, purchaseOrder)
}

// Destory
func (p *purchaseOrderController) DestroyPurchaseOrder(c echo.Context) error {
	id := c.Param("id")
	err := p.u.DestroyPurchaseOrder(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Destroy PurchaseOrder")
}

// IndexOrderWithUserItem
func (p *purchaseOrderController) IndexOrderDetail(c echo.Context) error {
	orderDetails, err := p.u.GetPurchaseOrderDetails(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, orderDetails)
}

func (p *purchaseOrderController) ShowOrderDetail(c echo.Context) error {
	id := c.Param("id")
	orderDetail, err := p.u.GetPurchaseOrderDetailByID(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, orderDetail)
}

func (p *purchaseOrderController) IndexOrderDetailByYear(c echo.Context) error {
	year := c.Param("year")
	orderDetails, err := p.u.GetPurchaseOrderDetailsByYear(c.Request().Context(), year)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, orderDetails)
}

func (p *purchaseOrderController) IndexUnregisteredOrderDetailByYear(c echo.Context) error {
	year := c.Param("year")
	orderDetails, err := p.u.GetUnregisteredPurchaseOrderDetailsByYear(c.Request().Context(), year)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, orderDetails)
}
