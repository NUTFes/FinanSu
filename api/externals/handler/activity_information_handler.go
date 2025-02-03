package handler

import (
	"net/http"
	"strconv"

	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/labstack/echo/v4"
)

// router.GET(baseURL+"/activity_informations", wrapper.GetActivityInformations)
func (h *Handler) GetActivityInformations(c echo.Context) error {
	activityInformations, err := h.activityInformationUseCase.GetActivityInformation(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, activityInformations)
}

// router.POST(baseURL+"/activity_informations", wrapper.PostActivityInformations)
func (h *Handler) PostActivityInformations(c echo.Context) error {
	activityInformation := new(domain.ActivityInformation)
	if err := c.Bind(activityInformation); err != nil {
		return err
	}

	latastActivityInformation, err := h.activityInformationUseCase.CreateActivityInformation(c.Request().Context(),
		strconv.Itoa(int(activityInformation.ActivityId)),
		activityInformation.BucketName,
		activityInformation.FileName,
		activityInformation.FileType,
		strconv.Itoa(int(activityInformation.DesignProgress)),
		activityInformation.FileInformation,
	)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, latastActivityInformation)
}

// router.DELETE(baseURL+"/activity_informations/:id", wrapper.DeleteActivityInformationsId)
func (h *Handler) DeleteActivityInformationsId(c echo.Context, id int) error {
	idStr := strconv.Itoa(id)
	err := h.activityInformationUseCase.DestroyActivityInformation(c.Request().Context(), idStr)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, "Destroy ActivityInformations")
}

// router.GET(baseURL+"/activity_informations/:id", wrapper.GetActivityInformationsId)
func (h *Handler) GetActivityInformationsId(c echo.Context) error {
	id := c.Param("id")
	activityInformation, err := h.activityInformationUseCase.GetActivityInformationByID(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, activityInformation)
}

// router.PUT(baseURL+"/activity_informations/:id", wrapper.PutActivityInformationsId)
func (h *Handler) PutActivityInformationsId(c echo.Context) error {
	id := c.Param("id")
	activityInformation := new(domain.ActivityInformation)
	if err := c.Bind(activityInformation); err != nil {
		return err
	}
	updatedActivity, err := h.activityInformationUseCase.UpdateActivityInformation(c.Request().Context(),
		id,
		strconv.Itoa(int(activityInformation.ActivityId)),
		activityInformation.BucketName,
		activityInformation.FileName,
		activityInformation.FileType,
		strconv.Itoa(int(activityInformation.DesignProgress)),
		activityInformation.FileInformation)

	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, updatedActivity)
}
