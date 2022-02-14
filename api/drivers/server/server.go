package server

import (
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"net/http"
)

type Server struct {
	E *echo.Echo
}

type ServerInterface interface {
	GetEchoInstance() *echo.Echo
}

// サーバー起動
func RunServer() *Server {
	// echoのインスタンス
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// CORS対策
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000", "127.0.0.1:3000"}, // ドメイン
		AllowMethods: []string{http.MethodGet, http.MethodPut, http.MethodPost, http.MethodDelete},
	}))

	server := &Server{e}

	return server
}

func (s *Server) GetEchoInstance() *echo.Echo {
	return s.E
}
