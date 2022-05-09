package controller

import (
	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/labstack/echo/v4"
	"net/http"
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
	IndexFundInforUserAndTeach(echo.Context) error
	ShowFundInforUserAndTeach(echo.Context) error
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

	err := f.u.CreateFundInformation(c.Request().Context(), userID, teacherID, price, remark, isFirstCheck, isLastCheck)
	if err != nil {
		return err
	}
	return c.String(http.StatusCreated, "Created FundInformation")
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

	err := f.u.UpdateFundInformation(c.Request().Context(), id, userID, teacherID, price, remark, isFirstCheck, isLastCheck)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Updated FundInformation")
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

//IndexFundInforUserAndTeach
func (f *fundInformationController) IndexFundInforUserAndTeach(c echo.Context) error {
	fundinforuserandteachers, err := f.u.GetFundInforWithUserAndTeach(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, fundinforuserandteachers)
}

func (f *fundInformationController) ShowFundInforUserAndTeach(c echo.Context) error {
	id := c.Param("id")
	fundinforuserandteacher, err:= f.u.GetFundInforWithUserAndTeachByID(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, fundinforuserandteacher)
}