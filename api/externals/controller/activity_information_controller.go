package controller

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/NUTFes/FinanSu/api/internals/usecase"

	"github.com/labstack/echo/v4"
)

type activityInformationController struct {
	u usecase.ActivityInformationUseCase
}

type ActivityInformationController interface {
	IndexActivityInformation(echo.Context) error
	ShowActivityInformation(echo.Context) error
	CreateActivityInformation(echo.Context) error
	UpdateActivityInformation(echo.Context) error
	DestroyActivityInformation(echo.Context) error
}

func NewActivityInformationController(u usecase.ActivityInformationUseCase) ActivityInformationController {
	return &activityInformationController{u}
}

// Index
func (a *activityInformationController) IndexActivityInformation(c echo.Context) error {
	activityInformations, err := a.u.GetActivityInformation(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, activityInformations)
}

// Show
func (a *activityInformationController) ShowActivityInformation(c echo.Context) error {
	id := c.Param("id")
	activityInformation, err := a.u.GetActivityInformationByID(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, activityInformation)
}

// Create
func (a *activityInformationController) CreateActivityInformation(c echo.Context) error {
	activityInformation := new(domain.ActivityInformation)
	if err := c.Bind(activityInformation); err != nil {
		fmt.Println("err")
		return err
	}

	latastActivityInformation, err := a.u.CreateActivityInformation(c.Request().Context() ,
											 strconv.Itoa(int(activityInformation.ActivityId)),
											 activityInformation.BucketName,
											 activityInformation.FileName,
											 activityInformation.FileType,
											 strconv.Itoa(int(activityInformation.DesignProgress)))
	if err != nil { 
		return err
	}
	return c.JSON(http.StatusOK, latastActivityInformation)
}

// Update
func (a *activityInformationController) UpdateActivityInformation(c echo.Context) error {
	id := c.Param("id")
	activityInformation := new(domain.ActivityInformation)
	if err := c.Bind(activityInformation); err != nil {
		fmt.Println("err")
		return err
	}
	updatedActivity, err := a.u.UpdateActivityInformation(c.Request().Context(),
									id,
									strconv.Itoa(int(activityInformation.ActivityId)),
									activityInformation.BucketName,
									activityInformation.FileName,
									activityInformation.FileType,
									strconv.Itoa(int(activityInformation.DesignProgress)))
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, updatedActivity)
}

// Destroy
func (a *activityInformationController) DestroyActivityInformation(c echo.Context) error {
	id := c.Param("id")
	err := a.u.DestroyActivityInformation(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, "Destroy ActivityInformations")
}
