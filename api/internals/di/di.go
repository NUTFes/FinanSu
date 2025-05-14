package di

import (
	"fmt"
	"log"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/drivers/mc"
	"github.com/NUTFes/FinanSu/api/drivers/server"
	"github.com/NUTFes/FinanSu/api/externals/controller"
	"github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/NUTFes/FinanSu/api/router"
	"github.com/labstack/echo/v4"
)

func InitializeServer() (db.Client, *echo.Echo) {
	// DB接続
	client, err := db.ConnectMySQL()
	if err != nil {
		log.Fatal("db error")
	}

	crud := abstract.NewCrud(client)

	minioClient, err := mc.InitMinioClient()
	if err != nil {
		fmt.Println(err)
	}

	fmt.Println(minioClient)

	// Repository
	activityRepository := repository.NewActivityRepository(client, crud)
	activityInformationRepository := repository.NewActivityInformationsRepository(client, crud)
	activityStyleRepository := repository.NewActivityStyleRepository(client, crud)
	budgetRepository := repository.NewBudgetRepository(client, crud)
	bureauRepository := repository.NewBureauRepository(client, crud)
	buyReportRepository := repository.NewBuyReportRepository(client, crud)
	departmentRepository := repository.NewDepartmentRepository(client, crud)
	divisionRepository := repository.NewDivisionRepository(client, crud)
	expenseRepository := repository.NewExpenseRepository(client, crud)
	festivalItemRepository := repository.NewFestivalItemRepository(client, crud)
	financialRecordRepository := repository.NewFinancialRecordRepository(client, crud)
	incomeRepository := repository.NewIncomeRepository(client, crud)
	incomeExpenditureManagementRepository := repository.NewIncomeExpenditureManagementRepository(client, crud)
	mailAuthRepository := repository.NewMailAuthRepository(client, crud)
	objectHandleRepository := repository.NewObjectHandleRepository(minioClient)
	passwordResetTokenRepository := repository.NewPasswordResetTokenRepository(client, crud)
	purchaseItemRepository := repository.NewPurchaseItemRepository(client, crud)
	purchaseOrderRepository := repository.NewPurchaseOrderRepository(client, crud)
	purchaseReportRepository := repository.NewPurchaseReportRepository(client, crud)
	receiptRepository := repository.NewReceiptRepository(client, crud)
	sessionRepository := repository.NewSessionRepository(client)
	sourceRepository := repository.NewSourceRepository(client, crud)
	sponsorRepository := repository.NewSponsorRepository(client, crud)
	sponsorStyleRepository := repository.NewSponsorStyleRepository(client, crud)
	teacherRepository := repository.NewTeacherRepository(client, crud)
	transactionRepository := repository.NewTransactionRepository(client, crud)
	userRepository := repository.NewUserRepository(client, crud)
	yearRepository := repository.NewYearRepository(client, crud)
	// ↓

	// UseCase
	activityUseCase := usecase.NewActivityUseCase(activityRepository)
	activityInformationUseCase := usecase.NewActivityInformationUseCase(
		activityInformationRepository,
	)
	activityStyleUseCase := usecase.NewActivityStyleUseCase(activityStyleRepository)
	budgetUseCase := usecase.NewBudgetUseCase(budgetRepository)
	bureauUseCase := usecase.NewBureauUseCase(bureauRepository)
	buyReportUseCase := usecase.NewBuyReportUseCase(buyReportRepository, transactionRepository, objectHandleRepository, incomeExpenditureManagementRepository)
	departmentUseCase := usecase.NewDepartmentUseCase(departmentRepository)
	divisionUseCase := usecase.NewDivisionUseCase(divisionRepository)
	expenseUseCase := usecase.NewExpenseUseCase(expenseRepository)
	festivalUseCase := usecase.NewFestivalItemUseCase(festivalItemRepository, transactionRepository)
	financialRecordUseCase := usecase.NewFinancialRecordUseCase(financialRecordRepository)
	incomeUseCase := usecase.NewIncomeUseCase(incomeRepository, incomeExpenditureManagementRepository, transactionRepository)
	incomeExpenditureManagementUseCase := usecase.NewIncomeExpenditureManagementUseCase(incomeExpenditureManagementRepository)
	mailAuthUseCase := usecase.NewMailAuthUseCase(mailAuthRepository, sessionRepository)
	objectHandleUseCase := usecase.NewObjectUploadUseCase(objectHandleRepository)
	passwordResetTokenUseCase := usecase.NewPasswordResetTokenUseCase(
		passwordResetTokenRepository,
		userRepository,
		mailAuthRepository,
	)
	purchaseItemUseCase := usecase.NewPurchaseItemUseCase(purchaseItemRepository)
	purchaseOrderUseCase := usecase.NewPurchaseOrderUseCase(
		purchaseOrderRepository,
		bureauRepository,
		expenseRepository,
	)
	purchaseReportUseCase := usecase.NewPurchaseReportUseCase(purchaseReportRepository)
	receiptUseCase := usecase.NewReceiptUseCase(receiptRepository)
	sourceUseCase := usecase.NewSourceUseCase(sourceRepository)
	sponsorUseCase := usecase.NewSponsorUseCase(sponsorRepository)
	sponsorStyleUseCase := usecase.NewSponsorStyleUseCase(sponsorStyleRepository)
	teacherUseCase := usecase.NewTeacherUseCase(teacherRepository)
	userUseCase := usecase.NewUserUseCase(userRepository, sessionRepository)
	yearUseCase := usecase.NewYearUseCase(yearRepository)
	// ↓

	// Controller
	activityController := controller.NewActivityController(activityUseCase)
	activityInformationController := controller.NewActivityInformationController(
		activityInformationUseCase,
	)
	activityStyleController := controller.NewActivityStyleController(activityStyleUseCase)
	budgetController := controller.NewBudgetController(budgetUseCase)
	bureauController := controller.NewBureauController(bureauUseCase)
	buyReportContoroller := controller.NewBuyReportController(buyReportUseCase)
	departmentController := controller.NewDepartmentController(departmentUseCase)
	divisionController := controller.NewDivisionController(divisionUseCase)
	expenseController := controller.NewExpenseController(expenseUseCase)
	festivalItemController := controller.NewFestivalItemController(festivalUseCase)
	financialRecordController := controller.NewFinancialRecordController(financialRecordUseCase)
	healthcheckController := controller.NewHealthCheckController()
	incomeController := controller.NewIncomeController(incomeUseCase)
	incomeExpenditureManagementController := controller.NewIncomeExpenditureManagementController(incomeExpenditureManagementUseCase)
	mailAuthController := controller.NewMailAuthController(mailAuthUseCase)
	objectUploadController := controller.NewObjectUploadController(objectHandleUseCase)
	passwordResetTokenController := controller.NewPasswordResetTokenController(
		passwordResetTokenUseCase,
	)
	purchaseItemController := controller.NewPurchaseItemController(purchaseItemUseCase)
	purchaseOrderController := controller.NewPurchaseOrderController(purchaseOrderUseCase)
	purchaseReportController := controller.NewPurchaseReportController(purchaseReportUseCase)
	receiptController := controller.NewReceiptController(receiptUseCase)
	sourceController := controller.NewSourceController(sourceUseCase)
	sponsorController := controller.NewSponsorController(sponsorUseCase)
	sponsorStyleController := controller.NewSponsorStyleController(sponsorStyleUseCase)
	teacherController := controller.NewTeacherController(teacherUseCase)
	userController := controller.NewUserController(userUseCase)
	yearController := controller.NewYearController(yearUseCase)
	// ↓

	// router
	router := router.NewRouter(
		activityController,
		activityInformationController,
		activityStyleController,
		budgetController,
		bureauController,
		buyReportContoroller,
		departmentController,
		divisionController,
		expenseController,
		festivalItemController,
		financialRecordController,
		healthcheckController,
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
	)

	// ↓

	// Server
	e := server.RunServer(router)

	return client, e
}
