package router

import (
	"github.com/NUTFes/FinanSu/api/externals/controller"
	"github.com/labstack/echo/v4"
)

type router struct {
	healthcheckController controller.HealthcheckController
	budgetController      controller.BudgetController
}

type Router interface {
	ProvideRouter(*echo.Echo)
}

func NewRouter(
	healthController controller.HealthcheckController,
	budgetController controller.BudgetController,
) Router {
	return router{
		healthController,
		budgetController,
	}
}

func (r router) ProvideRouter(e *echo.Echo) {
	// Healthcheck
	e.GET("/", r.healthcheckController.IndexHealthcheck)

	// budgetsのRoute
	e.GET("/budgets", r.budgetController.IndexBudget)
	e.GET("/budgets/:id", r.budgetController.ShowBudget)
	e.POST("/budgets", r.budgetController.CreateBudget)
	e.PUT("/budgets/:id", r.budgetController.UpdateBudget)
	e.DELETE("/budgets/:id", r.budgetController.DestroyBudget)

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
