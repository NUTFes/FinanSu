package server

import (
	"github.com/NUTFes/FinanSu/api/router"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"net/http"
)

func RunServer(router router.Router) {
	// echoのインスタンス
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// CORS対策
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000", "127.0.0.1:3000", "http://localhost:3001", "127.0.0.1:3001", "https://finansu.nutfes.net"}, // ドメイン
		AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete},
	}))

	// ルーティング
	router.ProvideRouter(e)

	// サーバー起動
	e.Logger.Fatal(e.Start(":1323"))
}
