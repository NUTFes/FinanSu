package controller

import (
	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/labstack/echo/v4"
	"net/http"
)

type activityController struct {
	u usecase.ActivityUseCase
}

type ActivityController interface {
	IndexActivity(echo.Context) error
	ShowActivity(echo.Context) error
	CreateActivity(echo.Context) error
	UpdateActivity(echo.Context) error
	DestroyActivity(echo.Context) error
	IndexActivityWithSponsorAndStyle(echo.Context) error
}

func NewActivityController(u usecase.ActivityUseCase) ActivityController {
	return &activityController{u}
}

// Index
func (a *activityController) IndexActivity(c echo.Context) error {
	activities, err := a.u.GetActivities(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, activities)
}

// Show
func (a *activityController) ShowActivity(c echo.Context) error {
	id := c.Param("id")
	activity, err := a.u.GetActivityByID(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, activity)
}

// Create
func (a *activityController) CreateActivity(c echo.Context) error {
	sponsorStyleID := c.QueryParam("sponsor_style_id")
	userID := c.QueryParam("user_id")
	isDone := c.QueryParam("is_done")
	sponsorID := c.QueryParam("sponsor_id")
	err := a.u.CreateActivity(c.Request().Context(), sponsorStyleID, userID, isDone, sponsorID)
	if err != nil {
		return err
	}
	return c.String(http.StatusCreated, "Created Activity")
}

// Update
func (a *activityController) UpdateActivity(c echo.Context) error {
	id := c.Param("id")
	sponsorStyleID := c.QueryParam("sponsor_style_id")
	userID := c.QueryParam("user_id")
	isDone := c.QueryParam("is_done")
	sponsorID := c.QueryParam("sponsor_id")
	err := a.u.UpdateActivity(c.Request().Context(), id, sponsorStyleID, userID, isDone, sponsorID)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Updated Activity")
}

// Destroy
func (a *activityController) DestroyActivity(c echo.Context) error {
	id := c.Param("id")
	err := a.u.DestroyActivity(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Destroy Activity")
}

// For admin view
func (a *activityController) IndexActivityWithSponsorAndStyle(c echo.Context) error {
	activities, err := a.u.GetActivitiesWithSponsorAndStyle(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, activities)
}

