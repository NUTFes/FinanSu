package handler

import (
	"net/http"
	"strconv"

	"github.com/NUTFes/FinanSu/api/generated"
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
func (h *Handler) PostTeachers(c echo.Context, params generated.PostTeachersParams) error {
	name := params.Name
	position := params.Position
	departmentID := strconv.Itoa(*params.DepartmentId)
	room := params.Room
	isBlack := strconv.FormatBool(*params.IsBlack)
	remark := params.Remark
	latestTeacher, err := h.teacherUseCase.CreateTeacher(c.Request().Context(), name, position, departmentID, *room, isBlack, *remark)
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
func (h *Handler) GetTeachersFundRegisteredYear(c echo.Context, year int) error {
	yearStr := strconv.Itoa(year)
	fundRegisteredTeachers, err := h.teacherUseCase.GetFundRegisteredByPeriods(c.Request().Context(), yearStr)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, fundRegisteredTeachers)
}

// router.DELETE(baseURL+"/teachers/:id", wrapper.DeleteTeachersId)
func (h *Handler) DeleteTeachersId(c echo.Context, id int) error {
	idStr := strconv.Itoa(id)
	err := h.teacherUseCase.DestroyTeacher(c.Request().Context(), idStr)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Destroy Teacher")
}

// router.GET(baseURL+"/teachers/:id", wrapper.GetTeachersId)
func (h *Handler) GetTeachersId(c echo.Context, id int) error {
	idStr := strconv.Itoa(id)
	teacher, err := h.teacherUseCase.GetTeacherByID(c.Request().Context(), idStr)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, teacher)
}

// router.PUT(baseURL+"/teachers/:id", wrapper.PutTeachersId)
func (h *Handler) PutTeachersId(c echo.Context, id int, params generated.PutTeachersIdParams) error {
	idStr := strconv.Itoa(id)
	name := params.Name
	position := params.Position
	departmentID := strconv.Itoa(*params.DepartmentId)
	room := params.Room
	isBlack := strconv.FormatBool(*params.IsBlack)
	remark := params.Remark
	updateTeacher, err := h.teacherUseCase.UpdateTeacher(c.Request().Context(), idStr, name, position, departmentID, *room, isBlack, *remark)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, updateTeacher)
}
