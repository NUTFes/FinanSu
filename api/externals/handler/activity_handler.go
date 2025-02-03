package handler

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/labstack/echo/v4"
)

// router.GET(baseURL+"/activities", wrapper.GetActivities)
// router.POST(baseURL+"/activities", wrapper.PostActivities)
// router.GET(baseURL+"/activities/details", wrapper.GetActivitiesDetails)
// router.GET(baseURL+"/activities/details/:year", wrapper.GetActivitiesDetailsYear)
// router.GET(baseURL+"/activities/filtered_details", wrapper.GetActivitiesFilteredDetails)
// router.GET(baseURL+"/activities/filtered_details/:year", wrapper.GetActivitiesFilteredDetailsYear)
// router.DELETE(baseURL+"/activities/:id", wrapper.DeleteActivitiesId)
// router.GET(baseURL+"/activities/:id", wrapper.GetActivitiesId)
// router.PUT(baseURL+"/activities/:id", wrapper.PutActivitiesId)

// Index
func (h *Handler) GetActivities(c echo.Context) error {
	activities, err := h.activityUseCase.GetActivity(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, activities)
}

// Show
func (h *Handler) GetActivitiesId(c echo.Context) error {
	id := c.Param("id")
	activity, err := h.activityUseCase.GetActivityByID(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, activity)
}

// Create
func (h *Handler) PostActivities(c echo.Context) error {
	activities := new(domain.Activity)
	if err := c.Bind(activities); err != nil {
		fmt.Println("err")
		return err
	}
	latastActivity, err := h.activityUseCase.CreateActivity(c.Request().Context(), strconv.Itoa(int(activities.UserID)), strconv.FormatBool(activities.IsDone), strconv.Itoa(int(activities.SponsorID)), activities.Feature, strconv.Itoa(int(activities.Expense)), activities.Remark, strconv.Itoa(int(activities.Design)), activities.Url)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, latastActivity)
}

// Update
func (h *Handler) PutActivitiesId(c echo.Context) error {
	id := c.Param("id")
	activities := new(domain.Activity)
	if err := c.Bind(activities); err != nil {
		fmt.Println("err")
		return err
	}
	updatedActivity, err := h.activityUseCase.UpdateActivity(c.Request().Context(), id, strconv.Itoa(int(activities.UserID)), strconv.FormatBool(activities.IsDone), strconv.Itoa(int(activities.SponsorID)), activities.Feature, strconv.Itoa(int(activities.Expense)), activities.Remark, strconv.Itoa(int(activities.Design)), activities.Url)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, updatedActivity)
}

// Destroy
func (h *Handler) DeleteActivitiesId(c echo.Context, id int) error {
	idStr := strconv.Itoa(id)
	err := h.activityUseCase.DestroyActivity(c.Request().Context(), idStr)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Destroy Activity")
}

// For admin view
func (h *Handler) GetActivitiesDetails(c echo.Context) error {
	activities, err := h.activityUseCase.GetActivityDetail(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, activities)
}

// 年度で指定されたactivitiesとsponsor,sponsorStyle,userの一覧を取得
func (h *Handler) GetActivitiesDetailsYear(c echo.Context) error {
	year := c.Param("year")
	activities, err := h.activityUseCase.GetActivityDetailsByPeriod(c.Request().Context(), year)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, activities)
}

func (h *Handler) GetActivitiesFilteredDetails(c echo.Context) error {
	isDone := c.QueryParam("is_done")
	sponsorStyleIDs := c.QueryParams()["sponsor_style_id"]
	keyword := c.QueryParam("keyword")
	activities, err := h.activityUseCase.GetFilteredActivityDetail(c.Request().Context(), isDone, sponsorStyleIDs, keyword)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, activities)
}

func (h *Handler) GetActivitiesFilteredDetailsYear(c echo.Context) error {
	isDone := c.QueryParam("is_done")
	sponsorStyleIDs := c.QueryParams()["sponsor_style_id"]
	year := c.Param("year")
	keyword := c.QueryParam("keyword")
	activities, err := h.activityUseCase.GetFilteredActivityDetailByPeriod(c.Request().Context(), isDone, sponsorStyleIDs, year, keyword)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, activities)
}
