package server

import (
	"net/http"
	"os"

	"github.com/NUTFes/FinanSu/api/router"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func RunServer(router router.Router) {
	// echoのインスタンス
	e := echo.New()

	// Middleware
	e.Use(middleware.Recover())

	// log
	logger := middleware.LoggerWithConfig(
		middleware.LoggerConfig{
			Format: logFormat(),
			Output: os.Stdout,
		},
	)
	e.Use(logger)

	// CORS対策
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000", "127.0.0.1:3000", "http://localhost:3001", "127.0.0.1:3001", "http://localhost:8000", "127.0.0.1:8000", "https://finansu.nutfes.net"}, // ドメイン
		AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete},
	}))

	// ルーティング
	router.ProvideRouter(e)

	// サーバー起動
	e.Start(":1323")
}
