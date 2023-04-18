package controller

import (
	"net/http"
	"strconv"

	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/labstack/echo/v4"
)

type sponsorStyleController struct {
	u usecase.SponsorStyleUseCase
}

type SponsorStyleController interface {
	IndexSponsorStyle(echo.Context) error
	ShowSponsorStyle(echo.Context) error
	CreateSponsorStyle(echo.Context) error
	UpdateSponsorStyle(echo.Context) error
	DestroySponsorStyle(echo.Context) error
}

func NewSponsorStyleController(u usecase.SponsorStyleUseCase) SponsorStyleController {
	return &sponsorStyleController{u}
}

// Index
func (s *sponsorStyleController) IndexSponsorStyle(c echo.Context) error {
	sponsorStyles, err := s.u.GetSponsorStyles(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, sponsorStyles)
}

// show
func (s *sponsorStyleController) ShowSponsorStyle(c echo.Context) error {
	id := c.Param("id")
	sponsorStyle, err := s.u.GetSponsorStylesByID(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, sponsorStyle)
}

// Create
func (s *sponsorStyleController) CreateSponsorStyle(c echo.Context) error {
	sponsorStyle := new(domain.SponsorStyle)
	if err := c.Bind(sponsorStyle); err != nil {
		return err
	}
	latastSponsorStyle, err := s.u.CreateSponsorStyle(c.Request().Context(), sponsorStyle.Scale, strconv.FormatBool(sponsorStyle.IsColor), sponsorStyle.Price)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, latastSponsorStyle)
}

// Update
func (s *sponsorStyleController) UpdateSponsorStyle(c echo.Context) error {
	id := c.Param("id")
	sponsorStyle := new(domain.SponsorStyle)
	if err := c.Bind(sponsorStyle); err != nil {
		return err
	}
	updatedSponsorStyle, err := s.u.UpdateSponsorStyle(c.Request().Context(), id, sponsorStyle.Scale, strconv.FormatBool(sponsorStyle.IsColor), sponsorStyle.Price)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, updatedSponsorStyle)
}

// Destory
func (s *sponsorStyleController) DestroySponsorStyle(c echo.Context) error {
	id := c.Param("id")
	err := s.u.DestroySponsorStyle(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Destroy SponsorStyle")
}
