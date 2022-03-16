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
	sourceRepository := repository.NewSourceRepository(client)
	yearRepository := repository.NewYearRepository(client)
	budgetRepository := repository.NewBudgetRepository(client)
	fundInformationRepository := repository.NewFundInformationRepository(client)
	purchaseOrderRepository := repository.NewPurchaseOrderRepository(client)
	purchaseReportRepository := repository.NewPurchaseReportRepository(client)

	// ↓

	// UseCase
	sourceUseCase := usecase.NewSourceUsecase(sourceRepository)
	yearUseCase := usecase.NewYearUsecase(yearRepository)
	budgetUseCase := usecase.NewBudgetUsecase(budgetRepository)
	fundInformationUseCase := usecase.NewFundInformationUseCase(fundInformationRepository)
	purchaseOrderUseCase := usecase.NewPurchaseOrderUseCase(purchaseOrderRepository)
	purchaseReportUseCase := usecase.NewPurchaseReportUsecase(purchaseReportRepository)

	// ↓

	// Controller
	healthcheckController := controller.NewHealthCheckController()
	sourceController := controller.NewSourceController(sourceUseCase)
	yearController := controller.NewYearController(yearUseCase)
	budgetController := controller.NewBudgetController(budgetUseCase)
	fundInformationController := controller.NewFundInformationController(fundInformationUseCase)
	purchaseOrderController := controller.NewPurchaseOrderController(purchaseOrderUseCase)
	purchaseReportController := controller.NewPurchaseReportController(purchaseReportUseCase)

	// ↓

	// router
	router := router.NewRouter(
		healthcheckController,
		sourceController,
		yearController,
		budgetController,
		fundInformationController,
		purchaseOrderController,
		purchaseReportController,
	)

	// ↓

	// Server
	server.RunServer(router)

	return client
}
