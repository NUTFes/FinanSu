package handler

import (
	"net/http"

	"github.com/NUTFes/FinanSu/api/generated"
	"github.com/labstack/echo/v4"
)

// router.GET(baseURL+"/campus_donations/years/:year/floors/:floor_number", wrapper.GetCampusDonationsYearsYearFloorsFloorNumber)
func (h *Handler) GetCampusDonationsYearsYearFloorsFloorNumber(
	c echo.Context,
	year int,
	floorNumber string,
	params generated.GetCampusDonationsYearsYearFloorsFloorNumberParams,
) error {
	var groupKey *string
	if params.GroupKey != nil {
		value := string(*params.GroupKey)
		groupKey = &value
	}

	buildingFloors, err := h.campusDonationUseCase.GetBuildingFloorDonationsByYear(
		c.Request().Context(),
		year,
		floorNumber,
		groupKey,
	)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, buildingFloors)
}
