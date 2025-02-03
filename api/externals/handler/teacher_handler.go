package handler

import (
	"net/http"

	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/labstack/echo/v4"
)

// router.GET(baseURL+"/teachers", wrapper.GetTeachers)
func (h *Handler) GetTeachers(c echo.Context) error {
	teachers, err := h.teacherUseCase.GetTeachers(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, teachers)
}

// router.POST(baseURL+"/teachers", wrapper.PostTeachers)
func (h *Handler) PostTeachers(c echo.Context) error {
	name := c.QueryParam("name")
	position := c.QueryParam("position")
	departmentID := c.QueryParam("department_id")
	room := c.QueryParam("room")
	isBlack := c.QueryParam("is_black")
	remark := c.QueryParam("remark")
	latestTeacher, err := h.teacherUseCase.CreateTeacher(c.Request().Context(), name, position, departmentID, room, isBlack, remark)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusCreated, latestTeacher)
}

// router.DELETE(baseURL+"/teachers/delete", wrapper.DeleteTeachersDelete)
func (h *Handler) DeleteTeachersDelete(c echo.Context) error {
	destroyTeacherIDs := new(domain.DestroyTeacherIDs)
	if err := c.Bind(&destroyTeacherIDs); err != nil {
		return err
	}

	err := h.teacherUseCase.DestroyMultiTeachers(c.Request().Context(), destroyTeacherIDs.DeleteIDs)
	if err != nil {
		return c.String(http.StatusBadRequest, err.Error())
	}
	return c.String(http.StatusOK, "Destroy Teachers")
}

// router.GET(baseURL+"/teachers/fundRegistered/:year", wrapper.GetTeachersFundRegisteredYear)
func (h *Handler) GetTeachersFundRegisteredYear(c echo.Context) error {
	year := c.Param("year")
	fundRegisteredTeachers, err := h.teacherUseCase.GetFundRegisteredByPeriods(c.Request().Context(), year)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, fundRegisteredTeachers)
}

// router.DELETE(baseURL+"/teachers/:id", wrapper.DeleteTeachersId)
func (h *Handler) DeleteTeachersId(c echo.Context) error {
	id := c.Param("id")
	err := h.teacherUseCase.DestroyTeacher(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Destroy Teacher")
}

// router.GET(baseURL+"/teachers/:id", wrapper.GetTeachersId)
func (h *Handler) GetTeachersId(c echo.Context) error {
	id := c.Param("id")
	teacher, err := h.teacherUseCase.GetTeacherByID(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, teacher)
}

// router.PUT(baseURL+"/teachers/:id", wrapper.PutTeachersId)
func (h *Handler) PutTeachersId(c echo.Context) error {
	id := c.Param("id")
	name := c.QueryParam("name")
	position := c.QueryParam("position")
	departmentID := c.QueryParam("department_id")
	room := c.QueryParam("room")
	isBlack := c.QueryParam("is_black")
	remark := c.QueryParam("remark")
	updateTeacher, err := h.teacherUseCase.UpdateTeacher(c.Request().Context(), id, name, position, departmentID, room, isBlack, remark)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, updateTeacher)
}
