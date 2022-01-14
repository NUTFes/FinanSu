package controllers

import (
	"github.com/labstack/echo/v4"
	"net/http"
)

// 接続確認
func Healthcheck(c echo.Context) error {
	return c.String(http.StatusOK, "healthcheck: ok")
}
