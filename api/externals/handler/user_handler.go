package handler

import (
	"net/http"

	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/labstack/echo/v4"
)

// router.GET(baseURL+"/users", wrapper.GetUsers)
func (h *Handler) GetUsers(c echo.Context) error {
	users, err := h.userUseCase.GetUsers(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, users)
}

// router.POST(baseURL+"/users", wrapper.PostUsers)
func (h *Handler) PostUsers(c echo.Context) error {
	name := c.QueryParam("name")
	bureauID := c.QueryParam("bureau_id")
	roleID := c.QueryParam("role_id")
	latastUser, err := h.userUseCase.CreateUser(c.Request().Context(), name, bureauID, roleID)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusCreated, latastUser)
}

// router.DELETE(baseURL+"/users/delete", wrapper.DeleteUsersDelete)
func (h *Handler) DeleteUsersDelete(c echo.Context) error {
	destroyUser := new(domain.DestroyUserIDs)
	if err := c.Bind(destroyUser); err != nil {
		return err
	}
	err := h.userUseCase.DestroyMultiUsers(c.Request().Context(), destroyUser.DeleteIDs)
	if err != nil {
		return c.String(http.StatusBadRequest, err.Error())
	}
	return c.String(http.StatusOK, "Destroy Users")
}

// router.DELETE(baseURL+"/users/:id", wrapper.DeleteUsersId)
func (h *Handler) DeleteUsersId(c echo.Context) error {
	id := c.Param("id")
	err := h.userUseCase.DestroyUser(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Destroy User")
}

// router.GET(baseURL+"/users/:id", wrapper.GetUsersId)
func (h *Handler) GetUsersId(c echo.Context) error {
	id := c.Param("id")
	user, err := h.userUseCase.GetUserByID(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, user)
}

// router.PUT(baseURL+"/users/:id", wrapper.PutUsersId)
func (h *Handler) PutUsersId(c echo.Context) error {
	id := c.Param("id")
	name := c.QueryParam("name")
	bureauID := c.QueryParam("bureau_id")
	roleID := c.QueryParam("role_id")
	updatedUser, err := h.userUseCase.UpdateUser(c.Request().Context(), id, name, bureauID, roleID)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, updatedUser)
}
