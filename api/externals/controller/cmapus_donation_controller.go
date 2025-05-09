package controller

import (
	"net/http"

	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/labstack/echo/v4"
)

type campusDonationController struct {
	u usecase.CampusDonationUseCase
}

type CampusDonationController interface {
	IndexCampusDonationByFloor(echo.Context) error
	IndexCampusDonationBuildingByPeriod(echo.Context) error
}

func NewCampusDonationController(u usecase.CampusDonationUseCase) CampusDonationController {
	return &campusDonationController{u}
}

func (cdc *campusDonationController) IndexCampusDonationByFloor(c echo.Context) error {
	ctx := c.Request().Context()
	buildingId := c.Param("building_id")
	floorId := c.Param("floor_id")

	if floorId == "" {
		return c.String(http.StatusBadRequest, "floor_id is required")
	}

	campusDonationByFloors, err := cdc.u.GetCampusDonationByFloors(ctx, buildingId, floorId)
	if err != nil {
		return c.String(http.StatusBadRequest, "failed to buy_reports")
	}

	return c.JSON(http.StatusOK, campusDonationByFloors)
}

func (f *campusDonationController) IndexCampusDonationBuildingByPeriod(c echo.Context) error {
	ctx := c.Request().Context()
	year := c.Param("year")
	fundInformationBuildingByPeriod, err := f.u.GetCampusDonationBuildingByPeriod(ctx, year)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, fundInformationBuildingByPeriod)
}
