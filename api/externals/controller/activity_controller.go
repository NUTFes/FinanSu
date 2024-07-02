package controller

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/labstack/echo/v4"
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
	IndexActivityDetail(echo.Context) error
	IndexActivityDetailsByPeriod(echo.Context) error
	IndexFilteredActivityDetail(echo.Context) error
}

func NewActivityController(u usecase.ActivityUseCase) ActivityController {
	return &activityController{u}
}

// Index
func (a *activityController) IndexActivity(c echo.Context) error {
	activities, err := a.u.GetActivity(c.Request().Context())
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
	activities := new(domain.Activity)
	if err := c.Bind(activities); err != nil {
		fmt.Println("err")
		return err
	}
	latastActivity, err := a.u.CreateActivity(c.Request().Context() , strconv.Itoa(int(activities.UserID)), strconv.FormatBool(activities.IsDone), strconv.Itoa(int(activities.SponsorID)), activities.Feature, strconv.Itoa(int(activities.Expense)), activities.Remark, strconv.Itoa(int(activities.Design)) ,activities.Url)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, latastActivity)
}

// Update
func (a *activityController) UpdateActivity(c echo.Context) error {
	id := c.Param("id")
	activities := new(domain.Activity)
	if err := c.Bind(activities); err != nil {
		fmt.Println("err")
		return err
	}
	updatedActivity, err := a.u.UpdateActivity(c.Request().Context(), id , strconv.Itoa(int(activities.UserID)), strconv.FormatBool(activities.IsDone), strconv.Itoa(int(activities.SponsorID)), activities.Feature, strconv.Itoa(int(activities.Expense)), activities.Remark, strconv.Itoa(int(activities.Design)) ,activities.Url)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, updatedActivity)
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
func (a *activityController) IndexActivityDetail(c echo.Context) error {
	activities, err := a.u.GetActivityDetail(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, activities)
}

// 年度で指定されたactivitiesとsponsor,sponsorStyle,userの一覧を取得
func (a *activityController) IndexActivityDetailsByPeriod(c echo.Context) error {
	year := c.Param("year")
	activities, err := a.u.GetActivityDetailsByPeriod(c.Request().Context(), year)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, activities)
}

func (a *activityController) IndexFilteredActivityDetail(c echo.Context) error {
	isDone := c.QueryParam("is_done") 
	sponsorStyle := c.QueryParam("sponsor_style")
	keyword := c.QueryParam("keyword")
	activities, err := a.u.GetFilteredActivityDetail(c.Request().Context(), isDone, sponsorStyle, keyword)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, activities)
}