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
	userRepository := repository.NewUserRepository(client)
	mailAuthRepository := repository.NewMailAuthRepository(client)
	sessionRepository := repository.NewSessionRepository(client)
	departmentRepository := repository.NewDepartmentRepository(client)
	sourceRepository := repository.NewSourceRepository(client)
	yearRepository := repository.NewYearRepository(client)
	budgetRepository := repository.NewBudgetRepository(client)
	fundInformationRepository := repository.NewFundInformationRepository(client)
	purchaseOrderRepository := repository.NewPurchaseOrderRepository(client)
	purchaseReportRepository := repository.NewPurchaseReportRepository(client)
	purchaseItemRepository := repository.NewPurchaseItemRepository(client)
	sponsorStyleRepository := repository.NewSponsorStyleRepository(client)
	teacherRepository := repository.NewTeacherRepository(client)
	activityRepository := repository.NewActivityRepository(client, crud)
	sponsorRepository := repository.NewSponsorRepository(client)
	bureauRepository := repository.NewBureauRepository(client)
	// ↓

	// UseCase
	userUseCase := usecase.NewUserUseCase(userRepository, sessionRepository)
	mailAuthUseCase := usecase.NewMailAuthUseCase(mailAuthRepository, sessionRepository)
	departmentUseCase := usecase.NewDepartmentUseCase(departmentRepository)
	sourceUseCase := usecase.NewSourceUseCase(sourceRepository)
	yearUseCase := usecase.NewYearUseCase(yearRepository)
	budgetUseCase := usecase.NewBudgetUseCase(budgetRepository)
	fundInformationUseCase := usecase.NewFundInformationUseCase(fundInformationRepository)
	purchaseOrderUseCase := usecase.NewPurchaseOrderUseCase(purchaseOrderRepository)
	purchaseReportUseCase := usecase.NewPurchaseReportUseCase(purchaseReportRepository)
	purchaseItemUseCase := usecase.NewPurchaseItemUseCase(purchaseItemRepository)
	sponsorStyleUseCase := usecase.NewSponsorStyleUseCase(sponsorStyleRepository)
	teacherUseCase := usecase.NewTeacherUseCase(teacherRepository)
	activityUseCase := usecase.NewActivityUseCase(activityRepository)
	sponsorUseCase := usecase.NewSponsorUseCase(sponsorRepository)
	bureauUseCase := usecase.NewBureauUseCase(bureauRepository)
	// ↓

	// Controller
	healthcheckController := controller.NewHealthCheckController()
	mailAuthController := controller.NewMailAuthController(mailAuthUseCase)
	userController := controller.NewUserController(userUseCase)
	departmentController := controller.NewDepartmentController(departmentUseCase)
	sourceController := controller.NewSourceController(sourceUseCase)
	yearController := controller.NewYearController(yearUseCase)
	budgetController := controller.NewBudgetController(budgetUseCase)
	fundInformationController := controller.NewFundInformationController(fundInformationUseCase)
	purchaseOrderController := controller.NewPurchaseOrderController(purchaseOrderUseCase)
	purchaseReportController := controller.NewPurchaseReportController(purchaseReportUseCase)
	purchaseItemController := controller.NewPurchaseItemController(purchaseItemUseCase)
	sponsorStyleController := controller.NewSponsorStyleController(sponsorStyleUseCase)
	teacherController := controller.NewTeacherController(teacherUseCase)
	activityController := controller.NewActivityController(activityUseCase)
	sponsorController := controller.NewSponsorController(sponsorUseCase)
	bureauController := controller.NewBureauController(bureauUseCase)
	// ↓

	// router
	router := router.NewRouter(
		healthcheckController,
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
	)

	// ↓

	// Server
	server.RunServer(router)

	return client
}
