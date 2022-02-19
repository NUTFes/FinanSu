package controller

import (
	"github.com/labstack/echo/v4"
	"net/http"
)

type healthcheckController struct {
}

type HealthcheckController interface {
	IndexHealthcheck(echo.Context) error
}

func NewHealthCheckController() HealthcheckController {
	return &healthcheckController{}
}

func (hc healthcheckController) IndexHealthcheck(c echo.Context) error {
	return c.String(http.StatusOK, "healthcheck: ok")
}
