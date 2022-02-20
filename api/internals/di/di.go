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

func InitializeServer() {
	// DB接続
	client, err := db.ConnectMySQL()
	if err != nil {
		log.Fatal("db error")
	}
	defer client.CloseDB()

	// ↓

	// Repository
	budgetRepository := repository.NewBudgetRepository(client)

	// ↓

	// UseCase
	budgetUseCase := usecase.NewBudgetUsecase(budgetRepository)

	// ↓

	// Controller
	healthcheckController := controller.NewHealthCheckController()
	budgetController := controller.NewBudgetController(budgetUseCase)

	// ↓

	// router
	router := router.NewRouter(
		healthcheckController,
		budgetController,
	)

	// ↓

	// Server
	server.RunServer(router)
}
