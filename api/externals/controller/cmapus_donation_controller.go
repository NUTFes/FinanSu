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
	CreateCampusDonation(echo.Context) error
	UpdateCampusDonation(echo.Context) error
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

func (f *campusDonationController) CreateCampusDonation(c echo.Context) error {
	ctx := c.Request().Context()
	userId := c.QueryParam("user_id")
	teacherId := c.QueryParam("teacher_id")
	price := c.QueryParam("price")
	receivedAt := c.QueryParam("received_at")
	yearId := c.QueryParam("year_id")

	if userId == "" {
		return c.String(http.StatusBadRequest, "user_id is required")
	}
	if teacherId == "" {
		return c.String(http.StatusBadRequest, "teacher_id is required")
	}
	if price == "" {
		return c.String(http.StatusBadRequest, "price is required")
	}
	if receivedAt == "" {
		return c.String(http.StatusBadRequest, "received_at is required")
	}
	if yearId == "" {
		return c.String(http.StatusBadRequest, "year_id is required")
	}

	err := f.u.CreateCampusDonation(ctx, userId, teacherId, price, receivedAt, yearId)
	if err != nil {
		return err
	}
	return c.NoContent(http.StatusCreated)
}

func (f *campusDonationController) UpdateCampusDonation(c echo.Context) error {
	ctx := c.Request().Context()
	id := c.QueryParam("id")
	userId := c.QueryParam("user_id")
	teacherId := c.QueryParam("teacher_id")
	price := c.QueryParam("price")
	receivedAt := c.QueryParam("received_at")
	yearId := c.QueryParam("year_id")

	if id == "" {
		return c.String(http.StatusBadRequest, "id is required")
	}
	if userId == "" {
		return c.String(http.StatusBadRequest, "user_id is required")
	}
	if teacherId == "" {
		return c.String(http.StatusBadRequest, "teacher_id is required")
	}
	if price == "" {
		return c.String(http.StatusBadRequest, "price is required")
	}
	if receivedAt == "" {
		return c.String(http.StatusBadRequest, "received_at is required")
	}
	if yearId == "" {
		return c.String(http.StatusBadRequest, "year_id is required")
	}

	err := f.u.UpdateCampusDonation(ctx, id, userId, teacherId, price, receivedAt, yearId)
	if err != nil {
		return err
	}
	return c.NoContent(http.StatusOK)
}
