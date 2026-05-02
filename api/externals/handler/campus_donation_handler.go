package handler

import (
	"database/sql"
	"errors"
	"net/http"

	"github.com/NUTFes/FinanSu/api/generated"
	"github.com/labstack/echo/v4"
)

// router.POST(baseURL+"/campus_donations", wrapper.PostCampusDonations)
func (h *Handler) PostCampusDonations(c echo.Context) error {
	var request generated.PostCampusDonationsJSONRequestBody
	if err := c.Bind(&request); err != nil {
		return c.JSON(http.StatusBadRequest, "failed to bind")
	}

	campusDonation, err := h.campusDonationUseCase.CreateCampusDonation(c.Request().Context(), request)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusOK, campusDonation)
}

// router.GET(baseURL+"/campus_donations/years/:year/group_keys/:group_key/floors", wrapper.GetCampusDonationsYearsYearGroupKeysGroupKeyFloors)
func (h *Handler) GetCampusDonationsYearsYearGroupKeysGroupKeyFloors(
	c echo.Context,
	year int,
	groupKey generated.CampusDonationBuildingGroupKey,
	params generated.GetCampusDonationsYearsYearGroupKeysGroupKeyFloorsParams,
) error {
	groupKeyValue := string(groupKey)

	buildingFloors, err := h.campusDonationUseCase.GetBuildingFloorDonationsByYear(
		c.Request().Context(),
		year,
		&groupKeyValue,
		params.FloorNumber,
	)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, buildingFloors)
}

// router.PUT(baseURL+"/campus_donations/:id", wrapper.PutCampusDonationsId)
func (h *Handler) PutCampusDonationsId(c echo.Context, id int) error {
	var request generated.PutCampusDonationsIdJSONRequestBody
	if err := c.Bind(&request); err != nil {
		return c.JSON(http.StatusBadRequest, "failed to bind")
	}

	campusDonation, err := h.campusDonationUseCase.UpdateCampusDonation(c.Request().Context(), id, request)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return c.JSON(http.StatusNotFound, "campus donation not found")
		}
		return c.JSON(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusOK, campusDonation)
}
