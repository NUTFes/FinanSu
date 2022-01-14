//go:build wireinject
//+build wireinject

package di

import (
	"github.com/NUTFes/finansu/api/internal/externals/controllers"
	"github.com/NUTFes/finansu/api/internal/externals/db"
	"github.com/NUTFes/finansu/api/internal/externals/router"
	"github.com/NUTFes/finansu/api/internal/externals/usecases"
	"github.com/google/wire"
)

func InitializeServer() (router.Server, error) {
	panic(
		wire.Build(
			router.NewServer,
			usecases.NewBudgetUseCase,
			controllers.NewBudgetController,
		),
	)
}

func InitializeDB() (db.DB, error) {
	panic(
		wire.Build(
			db.InitializeDB,
		),
	)
}
