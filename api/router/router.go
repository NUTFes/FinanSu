package router

import (
	"github.com/NUTFes/FinanSu/api/externals/controller"
	"github.com/labstack/echo/v4"
)

type router struct {
	healthcheckController     controller.HealthcheckController
	budgetController          controller.BudgetController
	fundInformationController controller.FundInformationController
}

type Router interface {
	ProvideRouter(*echo.Echo)
}

func NewRouter(
	healthController controller.HealthcheckController,
	budgetController controller.BudgetController,
	fundInformationController controller.FundInformationController,
) Router {
	return router{
		healthController,
		budgetController,
		fundInformationController,
	}
}

func (r router) ProvideRouter(e *echo.Echo) {
	// Healthcheck
	e.GET("/", r.healthcheckController.IndexHealthcheck)

	// budgets
	e.GET("/budgets", r.budgetController.IndexBudget)
	e.GET("/budgets/:id", r.budgetController.ShowBudget)
	e.POST("/budgets", r.budgetController.CreateBudget)
	e.PUT("/budgets/:id", r.budgetController.UpdateBudget)
	e.DELETE("/budgets/:id", r.budgetController.DestroyBudget)

	// fund informations
	e.GET("/fund_informations", r.fundInformationController.IndexFundInformation)
	e.GET("/fund_informations/:id", r.fundInformationController.ShowFundInformation)
	e.POST("/fund_informations", r.fundInformationController.CreateFundInformation)
	e.PUT("/fund_informations/:id", r.fundInformationController.UpdateFundInformation)
	e.DELETE("/fund_informations/:id", r.fundInformationController.DestroyFundInformation)

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
