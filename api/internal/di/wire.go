//go:build wireinject
//+build wireinject

package di

import (
	"github.com/NUTFes/finansu/api/internal/externals/router"
	"github.com/google/wire"
)

func InitializeServer() (router.Server, error) {
	panic(wire.Build(router.NewServer))
}
