package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// router.GET(baseURL+"/campus_donations/years/:year/buildings/:building_id/floors/:floor_number", wrapper.GetCampusDonationsYearsYearBuildingsBuildingIdFloorsFloorNumber)
func (h *Handler) GetCampusDonationsYearsYearBuildingsBuildingIdFloorsFloorNumber(
	c echo.Context,
	year int,
	buildingId int,
	floorNumber string,
) error {
	buildingFloors, err := h.campusDonationUseCase.GetBuildingFloorDonationsByYear(
		c.Request().Context(),
		year,
		buildingId,
		floorNumber,
	)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, buildingFloors)
}
