package controller

import (
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
	GetCurrentUser(echo.Context) error
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
	user, err := u.u.GetUserByID(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, user)
}

// Create
func (u *userController) CreateUser(c echo.Context) error {
	name := c.QueryParam("name")
	bureauID := c.QueryParam("bureau_id")
	roleID := c.QueryParam("role_id")
	latastUser, err := u.u.CreateUser(c.Request().Context(), name, bureauID, roleID)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusCreated, latastUser)
}

// Update
func (u *userController) UpdateUser(c echo.Context) error {
	id := c.Param("id")
	name := c.QueryParam("name")
	bureauID := c.QueryParam("bureau_id")
	roleID := c.QueryParam("role_id")
	updatedUser, err := u.u.UpdateUser(c.Request().Context(), id, name, bureauID, roleID)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, updatedUser)
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

// ログインユーザーの取得
func (auth *userController) GetCurrentUser(c echo.Context) error {
	// headerからトークンを取得する
	accessToken := c.Request().Header["Access-Token"][0]
	user, err := auth.u.GetCurrentUser(c.Request().Context(), accessToken)
	if err != nil {
		c.JSON(http.StatusNotFound, user)
		return err
	} else {
		c.JSON(http.StatusOK, user)
		return nil
	}
}

