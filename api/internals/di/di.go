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
	budgetRepository := repository.NewBudgetRepository(client)
	fundInformationRepository := repository.NewFundInformationRepository(client)

	// ↓

	// UseCase
	budgetUseCase := usecase.NewBudgetUsecase(budgetRepository)
	fundInformationUseCase := usecase.NewFundInformationUseCase(fundInformationRepository)

	// ↓

	// Controller
	healthcheckController := controller.NewHealthCheckController()
	budgetController := controller.NewBudgetController(budgetUseCase)
	fundInformationController := controller.NewFundInformationController(fundInformationUseCase)

	// ↓

	// router
	router := router.NewRouter(
		healthcheckController,
		budgetController,
		fundInformationController,
	)

	// ↓

	// Server
	server.RunServer(router)

	return client
}
