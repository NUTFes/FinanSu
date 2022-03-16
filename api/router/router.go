package router

import (
	"github.com/NUTFes/FinanSu/api/externals/controller"
	"github.com/labstack/echo/v4"
)

type router struct {
	healthcheckController     controller.HealthcheckController
	budgetController          controller.BudgetController
	fundInformationController controller.FundInformationController
	purchaseOrderController		controller.PurchaseOrderController
	purchaseReportController  controller.PurchaseReportController
	purchaseItemController    controller.PurchaseItemController
	sponsorStyleController    controller.SponsorStyleController
	activityController    controller.ActivityController
}

type Router interface {
	ProvideRouter(*echo.Echo)
}

func NewRouter(
	healthController controller.HealthcheckController,
	budgetController controller.BudgetController,
	fundInformationController controller.FundInformationController,
	purchaseOrderController controller.PurchaseOrderController,
	purchaseReportController controller.PurchaseReportController,
	purchaseItemController controller.PurchaseItemController,
	sponsorStyleController controller.SponsorStyleController,
	activityController controller.ActivityController,

) Router {
	return router{
		healthController,
		budgetController,
		fundInformationController,
		purchaseOrderController,
		purchaseReportController,
		purchaseItemController,
		sponsorStyleController,
		activityController,
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
	e.GET("/purchaseorders", r.purchaseOrderController.IndexPurchaseOrder)
	e.GET("/purchaseorders/:id", r.purchaseOrderController.ShowPurchaseOrder)
	e.POST("/purchaseorders", r.purchaseOrderController.CreatePurchaseOrder)
	e.PUT("/purchaseorders/:id", r.purchaseOrderController.UpdatePurchaseOrder)
	e.DELETE("/purchaseorders/:id", r.purchaseOrderController.DestroyPurchaseOrder)

	// purchasereportsのRoute
	e.GET("/purchasereports", r.purchaseReportController.IndexPurchaseReport)
	e.GET("/purchasereports/:id", r.purchaseReportController.ShowPurchaseReport)
	e.POST("/purchasereports", r.purchaseReportController.CreatePurchaseReport)
	e.PUT("/purchasereports/:id", r.purchaseReportController.UpdatePurchaseReport)
	e.DELETE("/purchasereports/:id", r.purchaseReportController.DestroyPurchaseReport)

	// purchaseitemsのRoute
	e.GET("/purchaseitems", r.purchaseItemController.IndexPurchaseItem)
	e.GET("/purchaseitems/:id", r.purchaseItemController.ShowPurchaseItem)
	e.POST("/purchaseitems", r.purchaseItemController.CreatePurchaseItem)
	e.PUT("/purchaseitems/:id", r.purchaseItemController.UpdatePurchaseItem)
	e.DELETE("/purchaseitems/:id", r.purchaseItemController.DestroyPurchaseItem)

	//sponsorstylesのroute
	e.GET("/sponsorstyles", r.sponsorStyleController.IndexSponsorStyle)
	e.GET("/sponsorstyles/:id", r.sponsorStyleController.ShowSponsorStyle)
	e.POST("/sponsorstyles", r.sponsorStyleController.CreateSponsorStyle)
	e.PUT("/sponsorstyles/:id", r.sponsorStyleController.UpdateSponsorStyle)
	e.DELETE("/sponsorstyles/:id", r.sponsorStyleController.DestroySponsorStyle)
	
	// purchaseitemsのRoute
	e.GET("/activities", r.activityController.IndexActivity)
	e.GET("/activities/:id", r.activityController.ShowActivity)
	e.POST("/activities", r.activityController.CreateActivity)
	e.PUT("/activities/:id", r.activityController.UpdateActivity)
	e.DELETE("/activities/:id", r.activityController.DestroyActivity)

}
