// Code generated by Wire. DO NOT EDIT.

//go:generate go run github.com/google/wire/cmd/wire
//+build !wireinject

package di

import (
	"github.com/NUTFes/finansu/api/internal/externals/db"
	"github.com/NUTFes/finansu/api/internal/externals/router"
)

// Injectors from wire.go:

func InitializeServer() (router.Server, error) {
	server := router.NewServer()
	return server, nil
}

func InitializeDB() (db.DB, error) {
	dbDB := db.InitializeDB()
	return dbDB, nil
}
