package controller

import (
	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/labstack/echo/v4"
	"net/http"
)

type sourceController struct {
	u usecase.SourceUseCase
}

type SourceController interface {
	IndexSource(echo.Context) error
	ShowSource(echo.Context) error
	CreateSource(echo.Context) error
	UpdateSource(echo.Context) error
	DestroySource(echo.Context) error
}

func NewSourceController(u usecase.SourceUseCase) SourceController {
	return &sourceController{u}
}

// Index
func (s *sourceController) IndexSource(c echo.Context) error {
	sources, err := s.u.GetSources(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, sources)
}

// Show
func (s *sourceController) ShowSource(c echo.Context) error {
	id := c.Param("id")
	source, err := s.u.GetSourceByID(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, source)
}

// Create
func (s *sourceController) CreateSource(c echo.Context) error {
	name := c.QueryParam("name")
	latastSource,err := s.u.CreateSource(c.Request().Context(), name)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusCreated, latastSource)
}

// Update
func (s *sourceController) UpdateSource(c echo.Context) error {
	id := c.Param("id")
	name := c.QueryParam("name")
	updatedSource,err := s.u.UpdateSource(c.Request().Context(), id, name)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, updatedSource)
}

// Destroy
func (s *sourceController) DestroySource(c echo.Context) error {
	id := c.Param("id")
	err := s.u.DestroySource(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Destroy Source")
}
