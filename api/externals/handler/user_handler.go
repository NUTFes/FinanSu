package handler

import (
	"net/http"
	"strconv"

	"github.com/NUTFes/FinanSu/api/generated"
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
func (h *Handler) PostUsers(c echo.Context, params generated.PostUsersParams) error {
	name := params.Name
	bureauID := strconv.Itoa(params.BureauId)
	roleID := strconv.Itoa(params.RoleId)
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
func (h *Handler) DeleteUsersId(c echo.Context, id int) error {
	idStr := strconv.Itoa(id)
	err := h.userUseCase.DestroyUser(c.Request().Context(), idStr)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Destroy User")
}

// router.GET(baseURL+"/users/:id", wrapper.GetUsersId)
func (h *Handler) GetUsersId(c echo.Context, id int) error {
	idStr := strconv.Itoa(id)
	user, err := h.userUseCase.GetUserByID(c.Request().Context(), idStr)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, user)
}

// router.PUT(baseURL+"/users/:id", wrapper.PutUsersId)
func (h *Handler) PutUsersId(c echo.Context, id int, params generated.PutUsersIdParams) error {
	idStr := strconv.Itoa(id)
	name := params.Name
	bureauID := strconv.Itoa(params.BureauId)
	roleID := strconv.Itoa(params.RoleId)
	updatedUser, err := h.userUseCase.UpdateUser(c.Request().Context(), idStr, name, bureauID, roleID)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, updatedUser)
}
