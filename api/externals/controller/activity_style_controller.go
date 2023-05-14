package controller

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/labstack/echo/v4"
)

type activityStyleController struct {
	u usecase.ActivityStyleUseCase
}

type ActivityStyleController interface {
	IndexActivityStyle(echo.Context) error
	ShowActivityStyle(echo.Context) error
	CreateActivityStyle(echo.Context) error
	UpdateActivityStyle(echo.Context) error
	DestroyActivityStyle(echo.Context) error
}

func NewActivityStyleController(u usecase.ActivityStyleUseCase) ActivityStyleController {
	return &activityStyleController{u}
}

// Index
func (a *activityStyleController) IndexActivityStyle(c echo.Context) error {
	activityStyles, err := a.u.GetActivityStyle(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, activityStyles)
}

// Show
func (a *activityStyleController) ShowActivityStyle(c echo.Context) error {
	id := c.Param("id")
	activityStyle, err := a.u.GetActivityStyleByID(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, activityStyle)
}

// Create
func (a *activityStyleController) CreateActivityStyle(c echo.Context) error {
	activityStyle := new(domain.ActivityStyle)
	if err := c.Bind(activityStyle); err != nil {
		fmt.Println("err")
		return err
	}
	latastActivityStyle, err := a.u.CreateActivityStyle(c.Request().Context() , strconv.Itoa(int(activityStyle.ActivityID)), strconv.Itoa(int(activityStyle.SponsoStyleID)))
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, latastActivityStyle)
}

// Update
func (a *activityStyleController) UpdateActivityStyle(c echo.Context) error {
	id := c.Param("id")
	activityStyle := new(domain.ActivityStyle)
	if err := c.Bind(activityStyle); err != nil {
		fmt.Println("err")
		return err
	}
	updatedActivityStyle, err := a.u.UpdateActivityStyle(c.Request().Context(), id , strconv.Itoa(int(activityStyle.ActivityID)), strconv.Itoa(int(activityStyle.SponsoStyleID)))
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, updatedActivityStyle)
}

// Destroy
func (a *activityStyleController) DestroyActivityStyle(c echo.Context) error {
	id := c.Param("id")
	err := a.u.DestroyActivityStyle(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Destroy ActivityStyle")
}
