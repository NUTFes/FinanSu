package controller

import (
	"fmt"
	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/labstack/echo/v4"
	"net/http"
)

type teacherController struct {
	u usecase.TeacherUseCase
}

type TeacherController interface {
	IndexTeacher(echo.Context) error
	ShowTeacher(echo.Context) error
	CreateTeacher(echo.Context) error
	UpdateTeacher(echo.Context) error
	DestroyTeacher(echo.Context) error
}

func NewTeacherController(u usecase.TeacherUseCase) TeacherController {
	return &teacherController{u}
}

// Index
func (t *teacherController) IndexTeacher(c echo.Context) error {
	teachers, err := t.u.GetTeachers(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, teachers)
}

// Show
func (t *teacherController) ShowTeacher(c echo.Context) error {
	id := c.Param("id")
	teacher, err := t.u.GetTeacherByID(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, teacher)
}

// Create
func (t *teacherController) CreateTeacher(c echo.Context) error {
	name := c.QueryParam("name")
	position := c.QueryParam("position")
	departmentID := c.QueryParam("department_id")
	room := c.QueryParam("room")
	isBlack := c.QueryParam("is_black")
	remark := c.QueryParam("remark")
	err := t.u.CreateTeacher(c.Request().Context(), name, position, departmentID, room, isBlack, remark)
	if err != nil {
		return err
	}
	return c.String(http.StatusCreated, "Created Teacher")
}

// Update
func (t *teacherController) UpdateTeacher(c echo.Context) error {
	id := c.Param("id")
	name := c.QueryParam("name")
	position := c.QueryParam("position")
	departmentID := c.QueryParam("department_id")
	room := c.QueryParam("room")
	isBlack := c.QueryParam("is_black")
	remark := c.QueryParam("remark")
	err := t.u.UpdateTeacher(c.Request().Context(), id, name, position, departmentID, room, isBlack, remark)
	if err != nil {
		return err
	}
	fmt.Println("controller")
	return c.String(http.StatusOK, "Updated Budget")
}

// Destroy
func (t *teacherController) DestroyTeacher(c echo.Context) error {
	id := c.Param("id")
	err := t.u.DestroyTeacher(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Destroy Teacher")
}
