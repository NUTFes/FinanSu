package handler

import (
	"net/http"
	"strconv"

	"github.com/NUTFes/FinanSu/api/generated"
	"github.com/labstack/echo/v4"
)

// router.GET(baseURL+"/departments", wrapper.GetDepartments)
func (h *Handler) GetDepartments(c echo.Context) error {
	departments, err := h.departmentUseCase.GetDepartments(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, departments)
}

// router.POST(baseURL+"/departments", wrapper.PostDepartments)
func (h *Handler) PostDepartments(c echo.Context, params generated.PostDepartmentsParams) error {
	latastDepartment, err := h.departmentUseCase.CreateDepartment(c.Request().Context(), *params.Name)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, latastDepartment)
}

// router.DELETE(baseURL+"/departments/:id", wrapper.DeleteDepartmentsId)
func (h *Handler) DeleteDepartmentsId(c echo.Context, id int) error {
	idStr := strconv.Itoa(id)
	err := h.departmentUseCase.DestroyDepartment(c.Request().Context(), idStr)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, "Destroy Department")
}

// router.GET(baseURL+"/departments/:id", wrapper.GetDepartmentsId)
func (h *Handler) GetDepartmentsId(c echo.Context, id int) error {
	idStr := strconv.Itoa(id)
	department, err := h.departmentUseCase.GetDepartmentByID(c.Request().Context(), idStr)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, department)
}

// router.PUT(baseURL+"/departments/:id", wrapper.PutDepartmentsId)
func (h *Handler) PutDepartmentsId(c echo.Context, id int, params generated.PutDepartmentsIdParams) error {
	idStr := strconv.Itoa(id)
	name := params.Name
	updatedDepartment, err := h.departmentUseCase.UpdateDepartment(c.Request().Context(), idStr, *name)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, updatedDepartment)
}
