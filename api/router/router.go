package router

import (
	"github.com/NUTFes/FinanSu/api/externals/controller"
	"github.com/labstack/echo/v4"
)

type router struct {
	activityController                    controller.ActivityController
	activityInformationController         controller.ActivityInformationController
	activityStyleController               controller.ActivityStyleController
	budgetController                      controller.BudgetController
	bureauController                      controller.BureauController
	buyReportController                   controller.BuyReportController
	departmentController                  controller.DepartmentController
	expenseController                     controller.ExpenseController
	festivalItemController                controller.FestivalItemController
	financialRecordController             controller.FinancialRecordController
	divisionController                    controller.DivisionController
	healthcheckController                 controller.HealthcheckController
	incomeController                      controller.IncomeController
	incomeExpenditureManagementController controller.IncomeExpenditureManagementController
	mailAuthController                    controller.MailAuthController
	objectUploadController                controller.ObjectUploadController
	passwordResetTokenController          controller.PasswordResetTokenController
	purchaseItemController                controller.PurchaseItemController
	purchaseOrderController               controller.PurchaseOrderController
	purchaseReportController              controller.PurchaseReportController
	receiptController                     controller.ReceiptController
	sourceController                      controller.SourceController
	sponsorController                     controller.SponsorController
	sponsorStyleController                controller.SponsorStyleController
	teacherController                     controller.TeacherController
	userController                        controller.UserController
	yearController                        controller.YearController
}

type Router interface {
	ProvideRouter(*echo.Echo)
}

func NewRouter(
	activityController controller.ActivityController,
	activityInformationController controller.ActivityInformationController,
	activitystyleController controller.ActivityStyleController,
	budgetController controller.BudgetController,
	bureauController controller.BureauController,
	buyReportController controller.BuyReportController,
	departmentController controller.DepartmentController,
	divisionController controller.DivisionController,
	expenseController controller.ExpenseController,
	festivalItemController controller.FestivalItemController,
	financialRecordController controller.FinancialRecordController,
	healthController controller.HealthcheckController,
	incomeController controller.IncomeController,
	incomeExpenditureManagementController controller.IncomeExpenditureManagementController,
	mailAuthController controller.MailAuthController,
	objectUploadController controller.ObjectUploadController,
	passwordResetTokenController controller.PasswordResetTokenController,
	purchaseItemController controller.PurchaseItemController,
	purchaseOrderController controller.PurchaseOrderController,
	purchaseReportController controller.PurchaseReportController,
	receiptController controller.ReceiptController,
	sourceController controller.SourceController,
	sponsorController controller.SponsorController,
	sponsorStyleController controller.SponsorStyleController,
	teacherController controller.TeacherController,
	userController controller.UserController,
	yearController controller.YearController,
) Router {
	return router{
		activityController,
		activityInformationController,
		activitystyleController,
		budgetController,
		bureauController,
		buyReportController,
		departmentController,
		expenseController,
		festivalItemController,
		financialRecordController,
		divisionController,
		healthController,
		incomeController,
		incomeExpenditureManagementController,
		mailAuthController,
		objectUploadController,
		passwordResetTokenController,
		purchaseItemController,
		purchaseOrderController,
		purchaseReportController,
		receiptController,
		sourceController,
		sponsorController,
		sponsorStyleController,
		teacherController,
		userController,
		yearController,
	}
}

func (r router) ProvideRouter(e *echo.Echo) {
	// Healthcheck
	e.GET("/", r.healthcheckController.IndexHealthcheck)

	// activitiesのRoute
	e.GET("/activities", r.activityController.IndexActivity)
	e.GET("/activities/:id", r.activityController.ShowActivity)
	e.POST("/activities", r.activityController.CreateActivity)
	e.PUT("/activities/:id", r.activityController.UpdateActivity)
	e.DELETE("/activities/:id", r.activityController.DestroyActivity)
	e.GET("/activities/details", r.activityController.IndexActivityDetail)
	e.GET("/activities/details/:year", r.activityController.IndexActivityDetailsByPeriod)
	e.GET("/activities/filtered_details", r.activityController.IndexFilteredActivityDetail)
	e.GET(
		"/activities/filtered_details/:year",
		r.activityController.IndexFilteredActivityDetailByPeriod,
	)

	// activityInformationsのRoute
	e.GET("/activity_informations", r.activityInformationController.IndexActivityInformation)
	e.GET("/activity_informations/:id", r.activityInformationController.ShowActivityInformation)
	e.POST("/activity_informations", r.activityInformationController.CreateActivityInformation)
	e.PUT("/activity_informations/:id", r.activityInformationController.UpdateActivityInformation)
	e.DELETE(
		"/activity_informations/:id",
		r.activityInformationController.DestroyActivityInformation,
	)

	// activityStyleのRoute
	e.GET("/activity_styles", r.activityStyleController.IndexActivityStyle)
	e.GET("/activity_styles/:id", r.activityStyleController.ShowActivityStyle)
	e.POST("/activity_styles", r.activityStyleController.CreateActivityStyle)
	e.PUT("/activity_styles/:id", r.activityStyleController.UpdateActivityStyle)
	e.DELETE("/activity_styles/:id", r.activityStyleController.DestroyActivityStyle)

	// budgetsのRoute
	e.GET("/budgets", r.budgetController.IndexBudget)
	e.GET("/budgets/:id", r.budgetController.ShowBudget)
	e.POST("/budgets", r.budgetController.CreateBudget)
	e.PUT("/budgets/:id", r.budgetController.UpdateBudget)
	e.DELETE("/budgets/:id", r.budgetController.DestroyBudget)
	e.GET("/budgets/:id/details", r.budgetController.ShowBudgetDetailById)
	e.GET("/budgets/details", r.budgetController.ShowBudgetDetails)
	e.GET("/budgets/details/:year", r.budgetController.ShowBudgetDetailsByPeriods)

	//bureauのRoute
	e.GET("/bureaus", r.bureauController.IndexBureau)
	e.GET("/bureaus/:id", r.bureauController.ShowBureau)
	e.POST("/bureaus", r.bureauController.CreateBureau)
	e.PUT("/bureaus/:id", r.bureauController.UpdateBureau)
	e.DELETE("/bureaus/:id", r.bureauController.DestroyBureau)

	// buyReportsのRoute
	e.POST("/buy_reports", r.buyReportController.CreateBuyReport)
	e.GET("/buy_reports/:id", r.buyReportController.GetBuyReportById)
	e.PUT("/buy_reports/:id", r.buyReportController.UpdateBuyReport)
	e.DELETE("/buy_reports/:id", r.buyReportController.DeleteBuyReport)
	e.GET("/buy_reports/details", r.buyReportController.IndexBuyReport)
	e.GET("/buy_reports/csv/download", r.buyReportController.GetBuyReportsCsvDownload)
	e.PUT("/buy_report/status/:buy_report_id", r.buyReportController.UpdateBuyReportStatus)

	// current_user
	e.GET("/current_user", r.userController.GetCurrentUser)

	// departments
	e.GET("/departments", r.departmentController.IndexDepartment)
	e.GET("/departments/:id", r.departmentController.ShowDepartment)
	e.POST("/departments", r.departmentController.CreateDepartment)
	e.PUT("/departments/:id", r.departmentController.UpdateDepartment)
	e.DELETE("/departments/:id", r.departmentController.DestroyDepartment)

	// divisions
	e.GET("/divisions", r.divisionController.IndexDivisions)
	e.GET("/divisions/users", r.divisionController.GetDivisionOptions)
	e.GET("/divisions/:id", r.divisionController.GetDivision)
	e.GET("/divisions/years", r.divisionController.GetDivisionsYears)
	e.POST("/divisions", r.divisionController.CreateDivision)
	e.PUT("/divisions/:id", r.divisionController.UpdateDivision)
	e.DELETE("/divisions/:id", r.divisionController.DestroyDivision)

	// expenseのRoute
	e.GET("/expenses", r.expenseController.IndexExpense)
	e.GET("/expenses/updateTP", r.expenseController.UpdateExpenseTP)
	e.GET("/expenses/details", r.expenseController.IndexExpenseDetails)
	e.GET("/expenses/details/:year", r.expenseController.IndexExpenseDetailsByPeriod)
	e.GET("/expenses/:id", r.expenseController.ShowExpense)
	e.GET("/expenses/:id/details", r.expenseController.ShowExpenseDetail)
	e.GET("/expenses/fiscalyear/:year", r.expenseController.IndexExpenseByPeriod)
	e.POST("/expenses", r.expenseController.CreateExpense)
	e.PUT("/expenses/:id", r.expenseController.UpdateExpense)
	e.DELETE("/expenses/:id", r.expenseController.DestroyExpense)

	// festival items
	e.GET("/festival_items", r.festivalItemController.IndexFestivalItems)
	e.GET("/festival_items/details/:user_id", r.festivalItemController.IndexFestivalItemsForMypage)
	e.GET("/festival_items/:id", r.festivalItemController.GetFestivalItem)
	e.GET("/festival_items/users", r.festivalItemController.IndexFestivalItemOption)
	e.POST("/festival_items", r.festivalItemController.CreateFestivalItem)
	e.PUT("/festival_items/:id", r.festivalItemController.UpdateFestivalItem)
	e.DELETE("/festival_items/:id", r.festivalItemController.DestroyFestivalItem)

	// financial_records
	e.GET("/financial_records", r.financialRecordController.IndexFinancialRecords)
	e.GET("/financial_records/:id", r.financialRecordController.GetFinancialRecord)
	e.POST("/financial_records", r.financialRecordController.CreateFinancialRecord)
	e.PUT("/financial_records/:id", r.financialRecordController.UpdateFinancialRecord)
	e.DELETE("/financial_records/:id", r.financialRecordController.DestroyFinancialRecord)
	e.GET("/financial_records/csv/download", r.financialRecordController.DownloadFinancialRecordsCSV)

	// incomes
	e.GET("/incomes", r.incomeController.IndexIncome)
	e.POST("/incomes", r.incomeController.PostIncome)
	e.GET("/incomes/:id", r.incomeController.GetIncome)
	e.PUT("/incomes/:id", r.incomeController.PutIncome)
	e.DELETE("/incomes/:id", r.incomeController.DeleteIncome)

	// income_expenditure_managements
	e.GET("income_expenditure_managements", r.incomeExpenditureManagementController.IndexIncomeExpenditureManagements)
	e.PUT("/income_expenditure_managements/check/:id", r.incomeExpenditureManagementController.PutIncomeExpenditureManagementCheck)
	e.GET("/income_expenditure_management/csv/download", r.incomeExpenditureManagementController.DownloadIncomeExpenditureManagementCSV)

	// mail auth
	e.POST("/mail_auth/signup", r.mailAuthController.SignUp)
	e.POST("/mail_auth/signin", r.mailAuthController.SignIn)
	e.DELETE("/mail_auth/signout", r.mailAuthController.SignOut)
	e.GET("/mail_auth/is_signin", r.mailAuthController.IsSignIn)

	// objectUploadテスト
	e.POST("/upload_file", r.objectUploadController.UploadObject)

	//password_reset
	e.POST("/password_reset/:id", r.passwordResetTokenController.ChangePassword)
	e.POST("/password_reset/request", r.passwordResetTokenController.SendPasswordResetRequest)
	e.POST("/password_reset/:id/valid", r.passwordResetTokenController.ValidPasswordResetToken)

	// purchaseitemsのRoute
	e.GET("/purchaseitems", r.purchaseItemController.IndexPurchaseItem)
	e.GET("/purchaseitems/:id", r.purchaseItemController.ShowPurchaseItem)
	e.POST("/purchaseitems", r.purchaseItemController.CreatePurchaseItem)
	e.PUT("/purchaseitems/:id", r.purchaseItemController.UpdatePurchaseItem)
	e.DELETE("/purchaseitems/:id", r.purchaseItemController.DestroyPurchaseItem)
	e.GET("/purchaseitems/details", r.purchaseItemController.IndexPurchaseItemDetails)
	e.GET("/purchaseitems/:id/details", r.purchaseItemController.ShowPurchaseItemDetails)

	// parcahseordersのRoute
	e.GET("/purchaseorders", r.purchaseOrderController.IndexPurchaseOrder)
	e.GET("/purchaseorders/:id", r.purchaseOrderController.ShowPurchaseOrder)
	e.POST("/purchaseorders", r.purchaseOrderController.CreatePurchaseOrder)
	e.POST("/purchaseorders/send/:id", r.purchaseOrderController.NotifySlack)
	e.PUT("/purchaseorders/:id", r.purchaseOrderController.UpdatePurchaseOrder)
	e.DELETE("/purchaseorders/:id", r.purchaseOrderController.DestroyPurchaseOrder)
	e.GET("/purchaseorders/details", r.purchaseOrderController.IndexOrderDetail)
	e.GET("/purchaseorders/:id/details", r.purchaseOrderController.ShowOrderDetail)
	e.GET("/purchaseorders/details/:year", r.purchaseOrderController.IndexOrderDetailByYear)
	e.GET(
		"/purchaseorders/details/unregistered/:year",
		r.purchaseOrderController.IndexUnregisteredOrderDetailByYear,
	)

	// purchasereportsのRoute
	e.GET("/purchasereports", r.purchaseReportController.IndexPurchaseReport)
	e.GET("/purchasereports/:id", r.purchaseReportController.ShowPurchaseReport)
	e.POST("/purchasereports", r.purchaseReportController.CreatePurchaseReport)
	e.PUT("/purchasereports/:id", r.purchaseReportController.UpdatePurchaseReport)
	e.DELETE("/purchasereports/:id", r.purchaseReportController.DestroyPurchaseReport)
	e.GET("/purchasereports/details", r.purchaseReportController.IndexPurchaseReportDetails)
	e.GET("/purchasereports/:id/details", r.purchaseReportController.ShowPurchaseReportDetail)
	e.GET(
		"/purchasereports/details/:year",
		r.purchaseReportController.IndexPurchaseReportDetailsByYear,
	)

	// receiptsのRoute
	e.GET("/receipts", r.receiptController.IndexReceipt)
	e.GET("/receipts/:id", r.receiptController.ShowReceipt)
	e.GET("/receipts/reports/:id", r.receiptController.FindReceiptsByReportID)
	e.POST("/receipts", r.receiptController.CreateReceipt)
	e.PUT("/receipts/:id", r.receiptController.UpdateReceipt)
	e.DELETE("/receipts/:id", r.receiptController.DestroyReceipt)

	// sources
	e.GET("/sources", r.sourceController.IndexSource)
	e.GET("/sources/:id", r.sourceController.ShowSource)
	e.POST("/sources", r.sourceController.CreateSource)
	e.PUT("/sources/:id", r.sourceController.UpdateSource)
	e.DELETE("/sources/:id", r.sourceController.DestroySource)

	// sponsorのRoute
	e.GET("/sponsors", r.sponsorController.IndexSponsor)
	e.GET("/sponsors/:id", r.sponsorController.ShowSponsor)
	e.POST("/sponsors", r.sponsorController.CreateSponsor)
	e.PUT("/sponsors/:id", r.sponsorController.UpdateSponsor)
	e.DELETE("/sponsors/:id", r.sponsorController.DestroySponsor)
	e.GET("/sponsors/periods/:year", r.sponsorController.IndexSponsorByPeriod)
	e.POST("/sponsors/csv", r.sponsorController.CreateSponsorsByCsv)
	e.GET("/sponsors/rowAffected/:row", r.sponsorController.IndexSponsorsByRowAffected)

	// sponsorstylesのRoute
	e.GET("/sponsorstyles", r.sponsorStyleController.IndexSponsorStyle)
	e.GET("/sponsorstyles/:id", r.sponsorStyleController.ShowSponsorStyle)
	e.POST("/sponsorstyles", r.sponsorStyleController.CreateSponsorStyle)
	e.PUT("/sponsorstyles/:id", r.sponsorStyleController.UpdateSponsorStyle)
	e.DELETE("/sponsorstyles/:id", r.sponsorStyleController.DestroySponsorStyle)

	// teacherのRoute
	e.GET("/teachers", r.teacherController.IndexTeacher)
	e.GET("/teachers/:id", r.teacherController.ShowTeacher)
	e.GET("/teachers/fundRegistered/:year", r.teacherController.IndexFundRegisteredTeacher)
	e.POST("/teachers", r.teacherController.CreateTeacher)
	e.PUT("/teachers/:id", r.teacherController.UpdateTeacher)
	e.DELETE("/teachers/:id", r.teacherController.DestroyTeacher)
	e.DELETE("/teachers/delete", r.teacherController.DestroyMultiTeachers)

	// users
	e.GET("/users", r.userController.IndexUser)
	e.GET("/users/:id", r.userController.ShowUser)
	e.POST("/users", r.userController.CreateUser)
	e.PUT("/users/:id", r.userController.UpdateUser)
	e.DELETE("/users/:id", r.userController.DestroyUser)
	e.DELETE("/users/delete", r.userController.DestroyMultiUsers)

	// years
	e.GET("/years", r.yearController.IndexYear)
	e.GET("/years/:id", r.yearController.ShowYear)
	e.POST("/years", r.yearController.CreateYear)
	e.PUT("/years/:id", r.yearController.UpdateYear)
	e.DELETE("/years/:id", r.yearController.DestroyYear)

	// year_periods
	e.GET("/years/periods", r.yearController.IndexYearPeriods)
	e.POST("/years/periods", r.yearController.CreateYearPeriod)
	e.PUT("/years/periods/:id", r.yearController.UpdateYearPeriod)
	e.DELETE("/years/periods/:id", r.yearController.DestroyYearPeriod)
}
