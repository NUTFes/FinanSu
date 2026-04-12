package handler

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

// router.GET(baseURL+"/campus_donations/buildings/:year", wrapper.GetCampusDonationsBuildingsYear)
func (h *Handler) GetCampusDonationsBuildingsYear(c echo.Context, year int) error {
	yearStr := strconv.Itoa(year)
	buildingTotals, err := h.campusDonationUseCase.GetBuildingTotalsByYear(c.Request().Context(), yearStr)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, buildingTotals)
}
