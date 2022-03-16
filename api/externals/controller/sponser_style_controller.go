package controller

import(
	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/labstack/echo/v4"
	"net/http"
)

type sponserStyleController struct {
	u usecase.SponserStyleUseCase
}

type SponserStyleController interface {
	IndexSponserStyle(echo.Context) error
	ShowSponserStyle(echo.Context) error
	CreateSponserStyle(echo.Context) error
	UpdateSponserStyle(echo.Context) error
	DestroySponserStyle(echo.Context) error
}

func NewSponserStyleController(u usecase.SponserStyleUseCase) SponserStyleController {
	return &sponserStyleController{u}
}

//Index
func (s *sponserStyleController) IndexSponserStyle(c echo.Context) error {
	sponserStyles, err := s.u.GetSponserStyles(c.Request().Context())
	if err!= nil{
		return err
	}
	return c.JSON(http.StatusOK, sponserStyles)
}

//show
func(s *sponserStyleController) ShowSponserStyle(c echo.Context)error {
	id := c.Param("id") 
	sponserStyle, err := s.u.GetSponserStylesByID(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, sponserStyle)
}

//Create
func (s *sponserStyleController) CreateSponserStyle(c echo.Context)error {
	Scale := c.QueryParam("scale")
	IsColor := c.QueryParam("is_color")
	price := c.QueryParam("price")
	
	err := s.u.CreateSponserStyle(c.Request().Context(), Scale, IsColor, price)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Create SponserStyle")
}

//Update
func (s *sponserStyleController) UpdateSponserStyle(c echo.Context)error {
	id := c.Param("id")
	Scale := c.QueryParam("scale")
	IsColor := c.QueryParam("is_color")
	price := c.QueryParam("price")

	err := s.u.UpdateSponserStyle(c.Request().Context(), id, Scale, IsColor, price)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Update SponserStyle")
}

//Destory
func (s *sponserStyleController) DestroySponserStyle(c echo.Context)error {
	id :=c.Param("id")
	
	err := s.u.DestroySponserStyle(c.Request().Context(), id) 
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Destroy SponserStyle")
}