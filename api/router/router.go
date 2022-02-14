package router

import (
	. "github.com/NUTFes/FinanSu/api/externals/controller"
	"github.com/labstack/echo/v4"
)

func ProvideRouter(e *echo.Echo) {
	// Healthcheck
	e.GET("/", IndexHealthcheck)

	// budgetsのRoute
	e.GET("/budgets", IndexBudget)
	e.GET("/budgets/:id", ShowBudget)
	e.POST("/budgets", CreateBudget)
	e.PUT("/budgets/:id", UpdateBudget)
	e.DELETE("/budgets/:id", DestroyBudget)

	// parcahseordersのRoute
	// e.GET("/purchaseorders", GetPurchaseOrders())
	// e.GET("/purchaseorders/:id", GetPurchaseOrder())
	// e.POST("/purchaseorders", CreatePurchaseOrder())
	// e.PUT("/purchaseorders/:id", UpdatePurchaseOrder())
	// e.DELETE("/purchaseorders/:id", DeletePurchaseOrder())

	// purchasereportsのRoute
	// e.GET("/purchasereports", GetPurchaseReports())
	// e.GET("/purchasereports/:id", GetPurchaseReport())
	// e.POST("/purchasereports", CreatePurchaseReport())
	// e.PUT("/purchasereports/:id", UpdatePurchaseReport())
	// e.DELETE("/purchasereports/:id", DeletePurchaseReport())
}
