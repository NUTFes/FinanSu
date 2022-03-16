package router

import (
	"github.com/NUTFes/FinanSu/api/externals/controller"
	"github.com/labstack/echo/v4"
)

type router struct {
	healthcheckController     controller.HealthcheckController
	userController            controller.UserController
	departmentController      controller.DepartmentController
	sourceController          controller.SourceController
	yearController            controller.YearController
	budgetController          controller.BudgetController
	fundInformationController controller.FundInformationController
	purchaseOrderController   controller.PurchaseOrderController
	purchaseReportController  controller.PurchaseReportController
	purchaseItemController    controller.PurchaseItemController
}

type Router interface {
	ProvideRouter(*echo.Echo)
}

func NewRouter(
	healthController controller.HealthcheckController,
	userController controller.UserController,
	departmentController controller.DepartmentController,
	sourceController controller.SourceController,
	yearController controller.YearController,
	budgetController controller.BudgetController,
	fundInformationController controller.FundInformationController,
	purchaseOrderController controller.PurchaseOrderController,
	purchaseReportController controller.PurchaseReportController,
	purchaseItemController controller.PurchaseItemController,

) Router {
	return router{
		healthController,
		userController,
		departmentController,
		sourceController,
		yearController,
		budgetController,
		fundInformationController,
		purchaseOrderController,
		purchaseReportController,
		purchaseItemController,
	}
}

func (r router) ProvideRouter(e *echo.Echo) {
	// Healthcheck
	e.GET("/", r.healthcheckController.IndexHealthcheck)

	// users
	e.GET("/users", r.userController.IndexUser)
	e.GET("/users/:id", r.userController.ShowUser)
	e.POST("/users", r.userController.CreateUser)
	e.PUT("/users/:id", r.userController.UpdateUser)
	e.DELETE("/users/:id", r.userController.DestroyUser)

	// departments
	e.GET("/departments", r.departmentController.IndexDepartment)
	e.GET("/departments/:id", r.departmentController.ShowDepartment)
	e.POST("/departments", r.departmentController.CreateDepartment)
	e.PUT("/departments/:id", r.departmentController.UpdateDepartment)
	e.DELETE("/departments/:id", r.departmentController.DestroyDepartment)

	// sources
	e.GET("/sources", r.sourceController.IndexSource)
	e.GET("/sources/:id", r.sourceController.ShowSource)
	e.POST("/sources", r.sourceController.CreateSource)
	e.PUT("/sources/:id", r.sourceController.UpdateSource)
	e.DELETE("/sources/:id", r.sourceController.DestroySource)

	// years
	e.GET("/years", r.yearController.IndexYear)
	e.GET("/years/:id", r.yearController.ShowYear)
	e.POST("/years", r.yearController.CreateYear)
	e.PUT("/years/:id", r.yearController.UpdateYear)
	e.DELETE("/years/:id", r.yearController.DestroyYear)

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
}
