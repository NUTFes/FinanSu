package di

import (
	"log"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/drivers/server"
	"github.com/NUTFes/FinanSu/api/externals/controller"
	"github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/NUTFes/FinanSu/api/router"
)

func InitializeServer() db.Client {
	// DB接続
	client, err := db.ConnectMySQL()
	if err != nil {
		log.Fatal("db error")
	}

	crud := abstract.NewCrud(client)

	// ↓

	// Repository
	activityRepository := repository.NewActivityRepository(client, crud)
	activityInformationRepository := repository.NewActivityInformationsRepository(client, crud)
	activityStyleRepository := repository.NewActivityStyleRepository(client, crud)
	budgetRepository := repository.NewBudgetRepository(client, crud)
	bureauRepository := repository.NewBureauRepository(client, crud)
	departmentRepository := repository.NewDepartmentRepository(client, crud)
	expenseRepository := repository.NewExpenseRepository(client, crud)
	fundInformationRepository := repository.NewFundInformationRepository(client, crud)
	mailAuthRepository := repository.NewMailAuthRepository(client)
	passwordResetTokenRepository := repository.NewPasswordResetTokenRepository(client, crud)
	purchaseItemRepository := repository.NewPurchaseItemRepository(client, crud)
	purchaseOrderRepository := repository.NewPurchaseOrderRepository(client, crud)
	purchaseReportRepository := repository.NewPurchaseReportRepository(client, crud)
	sessionRepository := repository.NewSessionRepository(client)
	sourceRepository := repository.NewSourceRepository(client, crud)
	sponsorRepository := repository.NewSponsorRepository(client, crud)
	sponsorStyleRepository := repository.NewSponsorStyleRepository(client, crud)
	teacherRepository := repository.NewTeacherRepository(client, crud)
	userRepository := repository.NewUserRepository(client, crud)
	yearRepository := repository.NewYearRepository(client, crud)
	// ↓

	// UseCase
	activityUseCase := usecase.NewActivityUseCase(activityRepository)
	activityInformationUseCase := usecase.NewActivityInformationUseCase(activityInformationRepository)
	activityStyleUseCase := usecase.NewActivityStyleUseCase(activityStyleRepository)
	budgetUseCase := usecase.NewBudgetUseCase(budgetRepository)
	bureauUseCase := usecase.NewBureauUseCase(bureauRepository)
	departmentUseCase := usecase.NewDepartmentUseCase(departmentRepository)
	expenseUseCase := usecase.NewExpenseUseCase(expenseRepository)
	fundInformationUseCase := usecase.NewFundInformationUseCase(fundInformationRepository)
	mailAuthUseCase := usecase.NewMailAuthUseCase(mailAuthRepository, sessionRepository)
	passwordResetTokenUseCase := usecase.NewPasswordResetTokenUseCase(passwordResetTokenRepository)
	purchaseItemUseCase := usecase.NewPurchaseItemUseCase(purchaseItemRepository)
	purchaseOrderUseCase := usecase.NewPurchaseOrderUseCase(purchaseOrderRepository)
	purchaseReportUseCase := usecase.NewPurchaseReportUseCase(purchaseReportRepository)
	sourceUseCase := usecase.NewSourceUseCase(sourceRepository)
	sponsorUseCase := usecase.NewSponsorUseCase(sponsorRepository)
	sponsorStyleUseCase := usecase.NewSponsorStyleUseCase(sponsorStyleRepository)
	teacherUseCase := usecase.NewTeacherUseCase(teacherRepository)
	userUseCase := usecase.NewUserUseCase(userRepository, sessionRepository)
	yearUseCase := usecase.NewYearUseCase(yearRepository)
	// ↓

	// Controller
	activityController := controller.NewActivityController(activityUseCase)
	activityInformationController := controller.NewActivityInformationController(activityInformationUseCase)
	activityStyleController := controller.NewActivityStyleController(activityStyleUseCase)
	budgetController := controller.NewBudgetController(budgetUseCase)
	bureauController := controller.NewBureauController(bureauUseCase)
	departmentController := controller.NewDepartmentController(departmentUseCase)
	expenseController := controller.NewExpenseController(expenseUseCase)
	fundInformationController := controller.NewFundInformationController(fundInformationUseCase)
	healthcheckController := controller.NewHealthCheckController()
	mailAuthController := controller.NewMailAuthController(mailAuthUseCase)
	passwordResetTokenController := controller.NewPasswordResetTokenController(passwordResetTokenUseCase)
	purchaseItemController := controller.NewPurchaseItemController(purchaseItemUseCase)
	purchaseOrderController := controller.NewPurchaseOrderController(purchaseOrderUseCase)
	purchaseReportController := controller.NewPurchaseReportController(purchaseReportUseCase)
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
		departmentController,
		expenseController,
		fundInformationController,
		healthcheckController,
		mailAuthController,
		passwordResetTokenController,
		purchaseItemController,
		purchaseOrderController,
		purchaseReportController,
		sourceController,
		sponsorController,
		sponsorStyleController,
		teacherController,
		userController,
		yearController,
	)

	// ↓

	// Server
	server.RunServer(router)

	return client
}
