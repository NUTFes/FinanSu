package controller

import (
	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/labstack/echo/v4"
	"net/http"
)

type bureauController struct {
	u usecase.BureauUseCase
}

type BureauController interface {
	IndexBureau(echo.Context) error
	ShowBureau(echo.Context) error
	CreateBureau(echo.Context) error
	UpdateBureau(echo.Context) error
	DestroyBureau(echo.Context) error
}

func NewBureauController(u usecase.BureauUseCase) BureauController{
	return &bureauController{u}
}

func (b *bureauController) IndexBureau(c echo.Context) error {
	bureaus ,err := b.u.GetBureaus(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, bureaus)
}

func (b *bureauController) ShowBureau(c echo.Context) error{
	id := c.Param("id")
	bureau ,err :=b.u.GetBureauByID(c.Request().Context(),id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK,bureau)
}

func (b *bureauController) CreateBureau(c echo.Context) error{
	name :=c.QueryParam("name")
	err := b.u.CreateBureau(c.Request().Context(),name)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK,"Created Bureau")
} 

func (b *bureauController) UpdateBureau(c echo.Context) error{
	id := c.Param("id")
	name := c.QueryParam("name")
	err := b.u.UpdateBureau(c.Request().Context(),id,name)

	if err != nil {
		return err
	}
	return c.String(http.StatusOK,"Update Bureau")
}

func (b *bureauController) DestroyBureau(c echo.Context) error{
	id  := c.Param("id")
	err := b.u.DestroyBureau(c.Request().Context(),id)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Destroy Bureau")
}
