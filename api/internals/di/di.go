package di

import (
	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/drivers/server"
	"github.com/NUTFes/FinanSu/api/externals/controller"
	"github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/NUTFes/FinanSu/api/router"
	"log"
)

func InitializeServer() db.Client {
	// DB接続
	client, err := db.ConnectMySQL()
	if err != nil {
		log.Fatal("db error")
	}

	// ↓

	// Repository
	userRepository := repository.NewUserRepository(client)
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
	activityRepository := repository.NewActivityRepository(client)
	sponsorRepository := repository.NewSponsorRepository(client)
	// ↓

	// UseCase
	userUseCase := usecase.NewUserUseCase(userRepository)
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
	// ↓

	// Controller
	healthcheckController := controller.NewHealthCheckController()
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

	// ↓

	// router
	router := router.NewRouter(
		healthcheckController,
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
	)

	// ↓

	// Server
	server.RunServer(router)

	return client
}
