package contorllers

import (
	"github.com/labstack/echo/v4"
	"net/http"
)

func Healthcheck(c echo.Context) error {
	// 接続確認
	return c.String(http.StatusOK, "healthcheck: ok")
}
