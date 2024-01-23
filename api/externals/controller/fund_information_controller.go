package controller

import (
	"net/http"

	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/labstack/echo/v4"
)

type fundInformationController struct {
	u usecase.FundInformationUseCase
}

type FundInformationController interface {
	IndexFundInformation(echo.Context) error
	ShowFundInformation(echo.Context) error
	CreateFundInformation(echo.Context) error
	UpdateFundInformation(echo.Context) error
	DestroyFundInformation(echo.Context) error
	IndexFundInformationDetails(echo.Context) error
	ShowFundInformationDetailByID(echo.Context) error
	IndexFundInformationDetailsByYear(echo.Context) error
}

func NewFundInformationController(u usecase.FundInformationUseCase) FundInformationController {
	return &fundInformationController{u}
}

// Index
func (f *fundInformationController) IndexFundInformation(c echo.Context) error {
	fundInformations, err := f.u.GetFundInformations(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, fundInformations)
}

// Show
func (f *fundInformationController) ShowFundInformation(c echo.Context) error {
	id := c.Param("id")
	fundInformation, err := f.u.GetFundInformationByID(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, fundInformation)
}

// Create
func (f *fundInformationController) CreateFundInformation(c echo.Context) error {
	userID := c.QueryParam("user_id")
	teacherID := c.QueryParam("teacher_id")
	price := c.QueryParam("price")
	remark := c.QueryParam("remark")
	isFirstCheck := c.QueryParam("is_first_check")
	isLastCheck := c.QueryParam("is_last_check")
	receivedAt := c.QueryParam("received_at")

	latastFundInformation, err := f.u.CreateFundInformation(c.Request().Context(), userID, teacherID, price, remark, isFirstCheck, isLastCheck, receivedAt)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusCreated, latastFundInformation)
}

// Update
func (f *fundInformationController) UpdateFundInformation(c echo.Context) error {
	id := c.Param("id")
	userID := c.QueryParam("user_id")
	teacherID := c.QueryParam("teacher_id")
	price := c.QueryParam("price")
	remark := c.QueryParam("remark")
	isFirstCheck := c.QueryParam("is_first_check")
	isLastCheck := c.QueryParam("is_last_check")
	receivedAt := c.QueryParam("received_at")

	updatedFundInformation, err := f.u.UpdateFundInformation(c.Request().Context(), id, userID, teacherID, price, remark, isFirstCheck, isLastCheck, receivedAt)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, updatedFundInformation)
}

// Destroy
func (f *fundInformationController) DestroyFundInformation(c echo.Context) error {
	id := c.Param("id")
	err := f.u.DestroyFundInformation(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.String(http.StatusCreated, "Destroy FundInformation")
}

// IndexFundInforUserAndTeach
func (f *fundInformationController) IndexFundInformationDetails(c echo.Context) error {
	fundinforuserandteachers, err := f.u.GetFundInformationDetails(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, fundinforuserandteachers)
}

func (f *fundInformationController) ShowFundInformationDetailByID(c echo.Context) error {
	id := c.Param("id")
	fundinforuserandteacher, err := f.u.GetFundInformationDetailByID(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, fundinforuserandteacher)
}

// IndexFundInformationDetailsByYear
func (f *fundInformationController) IndexFundInformationDetailsByYear(c echo.Context) error {
	year := c.Param("year")
	fundInformationDetailsByYear, err := f.u.GetFundInformationDetailsByYear(c.Request().Context(), year)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, fundInformationDetailsByYear)
}
