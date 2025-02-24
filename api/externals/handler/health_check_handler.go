package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// router.GET(baseURL+"/", wrapper.Get)
func (h *Handler) Get(c echo.Context) error {
	return c.String(http.StatusOK, "healthcheck: ok")
}
