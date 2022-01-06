package router

import (
	"fmt"
	"github.com/NUTFes/finansu/api/internal/controllers"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"net/http"
)

type server struct {
	e *echo.Echo
}

type Server interface {
	Run() error
}

// Echo instance
func NewServer() Server {
	return &server{e: echo.New()}
}

// サーバーの起動
func (server *server) Run() error {
	// Middleware
	server.e.Use(middleware.Logger())
	server.e.Use(middleware.Recover())

	// CORS対策
	server.e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000", "127.0.0.1:3000"}, // ドメイン
		AllowMethods: []string{http.MethodGet, http.MethodPut, http.MethodPost, http.MethodDelete},
	}))

	// Routes
	server.e.GET("/", contorllers.Healthcheck)
	//	server.e.GET("/budgets", main.GetBudgets())

	err := server.e.Start(":1323")
	if err != nil {
		fmt.Println(err)
	}
	return nil
}
