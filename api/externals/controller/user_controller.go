package controller

import (
	"fmt"
	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/labstack/echo/v4"
	"net/http"
)

type userController struct {
	u usecase.UserUseCase
}

type UserController interface {
	IndexUser(echo.Context) error
	ShowUser(echo.Context) error
	CreateUser(echo.Context) error
	UpdateUser(echo.Context) error
	DestroyUser(echo.Context) error
}

func NewUserController(u usecase.UserUseCase) UserController {
	return &userController{u}
}

// Index
func (u *userController) IndexUser(c echo.Context) error {
	users, err := u.u.GetUsers(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, users)
}

// Show
func (u *userController) ShowUser(c echo.Context) error {
	id := c.Param("id")
	fmt.Println(c.Request().Header)
	user, err := u.u.GetUserByID(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, user)
}

// Create
func (u *userController) CreateUser(c echo.Context) error {
	name := c.QueryParam("name")
	departmentID := c.QueryParam("department_id")
	err := u.u.CreateUser(c.Request().Context(), name, departmentID)
	if err != nil {
		return err
	}
	return c.String(http.StatusCreated, "Created User")
}

// Update
func (u *userController) UpdateUser(c echo.Context) error {
	id := c.Param("id")
	name := c.QueryParam("name")
	departmentID := c.QueryParam("department_id")
	err := u.u.UpdateUser(c.Request().Context(), id, name, departmentID)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Updated User")
}

// Destroy
func (u *userController) DestroyUser(c echo.Context) error {
	id := c.Param("id")
	err := u.u.DestroyUser(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Destroy User")
}
