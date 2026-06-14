package server

import (
	"net/http"
	"os"

	"github.com/NUTFes/FinanSu/api/externals/handler"
	"github.com/NUTFes/FinanSu/api/generated"
	echo "github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	oapimiddleware "github.com/oapi-codegen/echo-middleware"
)

func RunServer(server *handler.Handler) *echo.Echo {
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
		AllowOrigins: []string{"http://localhost:3000", "127.0.0.1:3000", "http://view:3000", "http://localhost:3001", "127.0.0.1:3001", "http://localhost:8000", "127.0.0.1:8000", "https://finansu.nutfes.net", "https://stg-finansu.nutfes.net"}, // ドメイン
		AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete},
	}))

	swagger, err := generated.GetSwagger()
	if err != nil {
		panic(err)
	}
	swagger.Servers = nil
	e.Use(oapimiddleware.OapiRequestValidatorWithOptions(swagger, &oapimiddleware.Options{
		Skipper: func(c echo.Context) bool {
			return c.Path() != "/mail_auth/signup" || c.Request().Method != http.MethodPost
		},
	}))

	// ルーティング

	generated.RegisterHandlers(e, server)
	// サーバー起動
	return e
}
