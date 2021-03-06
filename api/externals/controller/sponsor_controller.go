package controller

import(
	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/labstack/echo/v4"
	"net/http"
)

type sponsorController struct {
	u usecase.SponsorUseCase
}

type SponsorController interface {
	IndexSponsor(echo.Context) error
	ShowSponsor(echo.Context) error
	CreateSponsor(echo.Context) error
	UpdateSponsor(echo.Context) error
	DestroySponsor(echo.Context) error
}

func NewSponsorController(u usecase.SponsorUseCase) SponsorController {
	return &sponsorController{u}
}

//Index
func (s *sponsorController) IndexSponsor(c echo.Context) error {
	sponsors, err := s.u.GetSponsor(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, sponsors)
}

//show
func (s *sponsorController) ShowSponsor(c echo.Context) error {
	id := c.Param("id")
	sponsor , err := s.u.GetSponsorByID(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, sponsor)
}

//create
func (s *sponsorController) CreateSponsor(c echo.Context) error {
	Name := c.QueryParam("name")
	Tel := c.QueryParam("tel")
	Email := c.QueryParam("email")
	Address := c.QueryParam("address")
	Representative := c.QueryParam("representative")

	err := s.u.CreateSponsor(c.Request().Context(), Name, Tel, Email, Address, Representative)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Create Sponsor")
}

//Update
func (s *sponsorController) UpdateSponsor(c echo.Context) error {
	id := c.Param("id")
	Name := c.QueryParam("name")
	Tel := c.QueryParam("tel")
	Email := c.QueryParam("email")
	Address := c.QueryParam("address")
	Representative := c.QueryParam("representative")
	
	err := s.u.UpdateSponsor(c.Request().Context(), id, Name , Tel, Email, Address, Representative)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Update Sponsor")
}

//Destory
func (s *sponsorController) DestroySponsor(c echo.Context) error {
	id := c.Param("id")

	err := s.u.DestroySponsor(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Destroy Sponsor")
}