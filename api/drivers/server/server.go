package server

import (
	_ "github.com/NUTFes/FinanSu/api/docs"
	"github.com/NUTFes/FinanSu/api/router"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	echoSwagger "github.com/swaggo/echo-swagger"
	"net/http"
	"os"
)

type (
	Response struct {
		Int64  int64  `json:"int64"`
		String string `json:"string"`
		World  *Item  `json:"world"`
	}

	Item struct {
		Text string `json:"text"`
	}
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
		AllowOrigins: []string{"http://localhost:3000", "127.0.0.1:3000", "http://localhost:3001", "127.0.0.1:3001", "https://finansu.nutfes.net"}, // ドメイン
		AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete},
	}))

	// ルーティング
	router.ProvideRouter(e)

	// swagger
	e.GET("/swagger/*", echoSwagger.WrapHandler)
	e.GET("/checkswagger/", checkswagger)

	// サーバー起動
	e.Start(":1323")
}

func checkswagger(c echo.Context) error {
	return c.JSON(http.StatusOK, &Response{
		Int64:  1,
		String: "string",
		World: &Item{
			Text: "checkswagger",
		},
	})
}
