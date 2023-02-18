package controller

import (
	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/labstack/echo/v4"
	"net/http"
)

type departmentController struct {
	u usecase.DepartmentUseCase
}

type DepartmentController interface {
	IndexDepartment(echo.Context) error
	ShowDepartment(echo.Context) error
	CreateDepartment(echo.Context) error
	UpdateDepartment(echo.Context) error
	DestroyDepartment(echo.Context) error
}

func NewDepartmentController(u usecase.DepartmentUseCase) DepartmentController {
	return &departmentController{u}
}

// Index
func (d *departmentController) IndexDepartment(c echo.Context) error {
	departments, err := d.u.GetDepartments(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, departments)
}

// Show
func (d *departmentController) ShowDepartment(c echo.Context) error {
	id := c.Param("id")
	department, err := d.u.GetDepartmentByID(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, department)
}

// Create
func (d *departmentController) CreateDepartment(c echo.Context) error {
	name := c.QueryParam("name")
	latastDepartment, err := d.u.CreateDepartment(c.Request().Context(), name)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusCreated, latastDepartment)
}

// Update
func (d *departmentController) UpdateDepartment(c echo.Context) error {
	id := c.Param("id")
	name := c.QueryParam("name")
	updatedDepartment, err := d.u.UpdateDepartment(c.Request().Context(), id, name)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, updatedDepartment)
}

// Destroy
func (d *departmentController) DestroyDepartment(c echo.Context) error {
	id := c.Param("id")
	err := d.u.DestroyDepartment(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Destroy Department")
}
