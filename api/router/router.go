package router

import (
	"github.com/NUTFes/FinanSu/api/externals/controller"
	"github.com/labstack/echo/v4"
)

type router struct {
	healthcheckController     controller.HealthcheckController
	mailAuthController        controller.MailAuthController
	userController            controller.UserController
	departmentController      controller.DepartmentController
	sourceController          controller.SourceController
	yearController            controller.YearController
	budgetController          controller.BudgetController
	fundInformationController controller.FundInformationController
	purchaseOrderController   controller.PurchaseOrderController
	purchaseReportController  controller.PurchaseReportController
	purchaseItemController    controller.PurchaseItemController
	sponsorStyleController    controller.SponsorStyleController
	teacherController         controller.TeacherController
	activityController        controller.ActivityController
	sponsorController         controller.SponsorController
	bureauController          controller.BureauController
	expenseController         controller.ExpenseController
}

type Router interface {
	ProvideRouter(*echo.Echo)
}

func NewRouter(
	healthController controller.HealthcheckController,
	mailAuthController controller.MailAuthController,
	userController controller.UserController,
	departmentController controller.DepartmentController,
	sourceController controller.SourceController,
	yearController controller.YearController,
	budgetController controller.BudgetController,
	fundInformationController controller.FundInformationController,
	purchaseOrderController controller.PurchaseOrderController,
	purchaseReportController controller.PurchaseReportController,
	purchaseItemController controller.PurchaseItemController,
	sponsorStyleController controller.SponsorStyleController,
	teacherController controller.TeacherController,
	activityController controller.ActivityController,
	sponsorController controller.SponsorController,
	bureauController controller.BureauController,
	expenseController controller.ExpenseController,
) Router {
	return router{
		healthController,
		mailAuthController,
		userController,
		departmentController,
		sourceController,
		yearController,
		budgetController,
		fundInformationController,
		purchaseOrderController,
		purchaseReportController,
		purchaseItemController,
		sponsorStyleController,
		teacherController,
		activityController,
		sponsorController,
		bureauController,
		expenseController,
	}
}

func (r router) ProvideRouter(e *echo.Echo) {
	// Healthcheck
	e.GET("/", r.healthcheckController.IndexHealthcheck)

	// mail auth
	e.POST("/mail_auth/signup", r.mailAuthController.SignUp)
	e.POST("/mail_auth/signin", r.mailAuthController.SignIn)
	e.DELETE("/mail_auth/signout", r.mailAuthController.SignOut)
	e.GET("/mail_auth/is_signin", r.mailAuthController.IsSignIn)

	// users
	e.GET("/users", r.userController.IndexUser)
	e.GET("/users/:id", r.userController.ShowUser)
	e.POST("/users", r.userController.CreateUser)
	e.PUT("/users/:id", r.userController.UpdateUser)
	e.DELETE("/users/:id", r.userController.DestroyUser)

	// current_user
	e.GET("/current_user", r.userController.GetCurrentUser)

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
	//budgetに紐づくyearとsourceの取得
	e.GET("/budgets/:id/details", r.budgetController.ShowBudgetDetailById)
	//budgetに紐づくyearとsourceの全件取得
	e.GET("/budgets/details", r.budgetController.ShowBudgetDetails)

	// fund informations
	e.GET("/fund_informations", r.fundInformationController.IndexFundInformation)
	e.GET("/fund_informations/:id", r.fundInformationController.ShowFundInformation)
	e.POST("/fund_informations", r.fundInformationController.CreateFundInformation)
	e.PUT("/fund_informations/:id", r.fundInformationController.UpdateFundInformation)
	e.DELETE("/fund_informations/:id", r.fundInformationController.DestroyFundInformation)
	e.GET("/fund_informations/details", r.fundInformationController.IndexFundInformationDetails)
	e.GET("/fund_informations/:id/details", r.fundInformationController.ShowFundInformationDetailByID)

	// parcahseordersのRoute
	e.GET("/purchaseorders", r.purchaseOrderController.IndexPurchaseOrder)
	e.GET("/purchaseorders/:id", r.purchaseOrderController.ShowPurchaseOrder)
	e.POST("/purchaseorders", r.purchaseOrderController.CreatePurchaseOrder)
	e.PUT("/purchaseorders/:id", r.purchaseOrderController.UpdatePurchaseOrder)
	e.DELETE("/purchaseorders/:id", r.purchaseOrderController.DestroyPurchaseOrder)
	e.GET("/purchaseorders/details", r.purchaseOrderController.IndexOrderDetail)
	e.GET("/purchaseorders/:id/details", r.purchaseOrderController.ShowOrderDetail)

	// purchasereportsのRoute
	e.GET("/purchasereports", r.purchaseReportController.IndexPurchaseReport)
	e.GET("/purchasereports/:id", r.purchaseReportController.ShowPurchaseReport)
	e.POST("/purchasereports", r.purchaseReportController.CreatePurchaseReport)
	e.PUT("/purchasereports/:id", r.purchaseReportController.UpdatePurchaseReport)
	e.DELETE("/purchasereports/:id", r.purchaseReportController.DestroyPurchaseReport)
	e.GET("/purchasereports/details", r.purchaseReportController.IndexPurchaseReportDetails)
	e.GET("/purchasereports/:id/details", r.purchaseReportController.ShowPurchaseReportDetail)

	// purchaseitemsのRoute
	e.GET("/purchaseitems", r.purchaseItemController.IndexPurchaseItem)
	e.GET("/purchaseitems/:id", r.purchaseItemController.ShowPurchaseItem)
	e.POST("/purchaseitems", r.purchaseItemController.CreatePurchaseItem)
	e.PUT("/purchaseitems/:id", r.purchaseItemController.UpdatePurchaseItem)
	e.DELETE("/purchaseitems/:id", r.purchaseItemController.DestroyPurchaseItem)
	e.GET("/purchaseitems/details", r.purchaseItemController.IndexPurchaseItemDetails)
	e.GET("/purchaseitems/:id/details", r.purchaseItemController.ShowPurchaseItemDetails)

	// sponsorstylesのRoute
	e.GET("/sponsorstyles", r.sponsorStyleController.IndexSponsorStyle)
	e.GET("/sponsorstyles/:id", r.sponsorStyleController.ShowSponsorStyle)
	e.POST("/sponsorstyles", r.sponsorStyleController.CreateSponsorStyle)
	e.PUT("/sponsorstyles/:id", r.sponsorStyleController.UpdateSponsorStyle)
	e.DELETE("/sponsorstyles/:id", r.sponsorStyleController.DestroySponsorStyle)

	// teacherのRoute
	e.GET("/teachers", r.teacherController.IndexTeacher)
	e.GET("/teachers/:id", r.teacherController.ShowTeacher)
	e.POST("/teachers", r.teacherController.CreateTeacher)
	e.PUT("/teachers/:id", r.teacherController.UpdateTeacher)
	e.DELETE("/teachers/:id", r.teacherController.DestroyTeacher)

	// activitiesのRoute
	e.GET("/activities", r.activityController.IndexActivity)
	e.GET("/activities/:id", r.activityController.ShowActivity)
	e.POST("/activities", r.activityController.CreateActivity)
	e.PUT("/activities/:id", r.activityController.UpdateActivity)
	e.DELETE("/activities/:id", r.activityController.DestroyActivity)
	e.GET("/activities/details", r.activityController.IndexActivityDetail)

	// sponsorのRoute
	e.GET("/sponsors", r.sponsorController.IndexSponsor)
	e.GET("/sponsors/:id", r.sponsorController.ShowSponsor)
	e.POST("/sponsors", r.sponsorController.CreateSponsor)
	e.PUT("/sponsors/:id", r.sponsorController.UpdateSponsor)
	e.DELETE("/sponsors/:id", r.sponsorController.DestroySponsor)

	//bureauのRoute
	e.GET("/bureaus", r.bureauController.IndexBureau)
	e.GET("/bureaus/:id", r.bureauController.ShowBureau)
	e.POST("/bureaus", r.bureauController.CreateBureau)
	e.PUT("/bureaus/:id", r.bureauController.UpdateBureau)
	e.DELETE("/bureaus/:id", r.bureauController.DestroyBureau)

	//expenseのRoute
	e.GET("/expense", r.expenseController.IndexExpense)
	e.GET("/expense/:id", r.expenseController.ShowExpense)
	e.POST("/expense", r.expenseController.CreateExpense)
	e.PUT("/expense/:id", r.expenseController.UpdateExpense)
	e.DELETE("/expense/:id", r.expenseController.DestroyExpense)
}
