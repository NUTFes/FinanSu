//go:build wireinject
//+build wireinject

package di

import (
	"github.com/NUTFes/finansu/api/internal/externals/db"
	"github.com/google/wire"
	"github.jcom/NUTFes/finansu/api/internal/externals/router"
)

func InitializeServer() (router.Server, error) {
	panic(
		wire.Build(
			router.NewServer,
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
