package handler

import (
	"net/http"
	"strconv"

	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/labstack/echo/v4"
)

// router.GET(baseURL+"/activity_styles", wrapper.GetActivityStyles)
func (h *Handler) GetActivityStyles(c echo.Context) error {
	activityStyles, err := h.activityStyleUseCase.GetActivityStyle(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, activityStyles)
}

// router.POST(baseURL+"/activity_styles", wrapper.PostActivityStyles)
func (h *Handler) PostActivityStyles(c echo.Context) error {
	activityStyle := new(domain.ActivityStyle)
	if err := c.Bind(activityStyle); err != nil {
		return err
	}

	latastActivityStyle, err := h.activityStyleUseCase.CreateActivityStyle(c.Request().Context(),
		strconv.Itoa(int(activityStyle.ActivityID)),
		strconv.Itoa(int(activityStyle.SponsoStyleID)),
	)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, latastActivityStyle)
}

// router.DELETE(baseURL+"/activity_styles/:id", wrapper.DeleteActivityStylesId)
func (h *Handler) DeleteActivityStylesId(c echo.Context, id int) error {
	idStr := strconv.Itoa(id)
	err := h.activityStyleUseCase.DestroyActivityStyle(c.Request().Context(), idStr)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, "Destroy ActivityStyles")
}

// router.GET(baseURL+"/activity_styles/:id", wrapper.GetActivityStylesId)
func (h *Handler) GetActivityStylesId(c echo.Context) error {
	id := c.Param("id")
	activityStyle, err := h.activityStyleUseCase.GetActivityStyleByID(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, activityStyle)
}

// router.PUT(baseURL+"/activity_styles/:id", wrapper.PutActivityStylesId)
func (h *Handler) PutActivityStylesId(c echo.Context) error {
	id := c.Param("id")
	activityStyle := new(domain.ActivityStyle)
	if err := c.Bind(activityStyle); err != nil {
		return err
	}

	updatedActivityStyle, err := h.activityStyleUseCase.UpdateActivityStyle(c.Request().Context(), id,
		strconv.Itoa(int(activityStyle.ActivityID)),
		strconv.Itoa(int(activityStyle.SponsoStyleID)),
	)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, updatedActivityStyle)
}

// // Index
// func (a *activityStyleController) IndexActivityStyle(c echo.Context) error {
// 	activityStyles, err := a.u.GetActivityStyle(c.Request().Context())
// 	if err != nil {
// 		return err
// 	}
// 	return c.JSON(http.StatusOK, activityStyles)
// }

// // Show
// func (a *activityStyleController) ShowActivityStyle(c echo.Context) error {
// 	id := c.Param("id")
// 	activityStyle, err := a.u.GetActivityStyleByID(c.Request().Context(), id)
// 	if err != nil {
// 		return err
// 	}
// 	return c.JSON(http.StatusOK, activityStyle)
// }

// // Create
// func (a *activityStyleController) CreateActivityStyle(c echo.Context) error {
// 	activityStyle := new(domain.ActivityStyle)
// 	if err := c.Bind(activityStyle); err != nil {
// 		fmt.Println("err")
// 		return err
// 	}
// 	latastActivityStyle, err := a.u.CreateActivityStyle(c.Request().Context() , strconv.Itoa(int(activityStyle.ActivityID)), strconv.Itoa(int(activityStyle.SponsoStyleID)))
// 	if err != nil {
// 		return err
// 	}
// 	return c.JSON(http.StatusOK, latastActivityStyle)
// }

// // Update
// func (a *activityStyleController) UpdateActivityStyle(c echo.Context) error {
// 	id := c.Param("id")
// 	activityStyle := new(domain.ActivityStyle)
// 	if err := c.Bind(activityStyle); err != nil {
// 		fmt.Println("err")
// 		return err
// 	}
// 	updatedActivityStyle, err := a.u.UpdateActivityStyle(c.Request().Context(), id , strconv.Itoa(int(activityStyle.ActivityID)), strconv.Itoa(int(activityStyle.SponsoStyleID)))
// 	if err != nil {
// 		return err
// 	}
// 	return c.JSON(http.StatusOK, updatedActivityStyle)
// }

// // Destroy
// func (a *activityStyleController) DestroyActivityStyle(c echo.Context) error {
// 	id := c.Param("id")
// 	err := a.u.DestroyActivityStyle(c.Request().Context(), id)
// 	if err != nil {
// 		return err
// 	}
// 	return c.String(http.StatusOK, "Destroy ActivityStyle")
// }
