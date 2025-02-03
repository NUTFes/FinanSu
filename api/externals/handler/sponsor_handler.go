package handler

import (
	"net/http"

	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/labstack/echo/v4"
)

// router.GET(baseURL+"/sponsors", wrapper.GetSponsors)
func (h *Handler) GetSponsors(c echo.Context) error {
	sponsors, err := h.sponsorUseCase.GetSponsor(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, sponsors)
}

// router.POST(baseURL+"/sponsors", wrapper.PostSponsors)
func (h *Handler) PostSponsors(c echo.Context) error {
	sponsor := new(domain.Sponsor)
	if err := c.Bind(sponsor); err != nil {
		return err
	}

	latastSponsor, err := h.sponsorUseCase.CreateSponsor(c.Request().Context(),
		sponsor.Name,
		sponsor.Tel,
		sponsor.Email,
		sponsor.Address,
		sponsor.Representative,
	)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, latastSponsor)
}

// router.GET(baseURL+"/sponsors/periods/:year", wrapper.GetSponsorsPeriodsYear)
func (h *Handler) GetSponsorsPeriodsYear(c echo.Context) error {
	year := c.Param("year")
	sponsors, err := h.sponsorUseCase.GetSponsorByPeriod(c.Request().Context(), year)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, sponsors)
}

// router.DELETE(baseURL+"/sponsors/:id", wrapper.DeleteSponsorsId)
func (h *Handler) DeleteSponsorsId(c echo.Context) error {
	id := c.Param("id")
	err := h.sponsorUseCase.DestroySponsor(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, "Destroy Sponsor")
}

// router.GET(baseURL+"/sponsors/:id", wrapper.GetSponsorsId)
func (h *Handler) GetSponsorsId(c echo.Context) error {
	id := c.Param("id")
	sponsor, err := h.sponsorUseCase.GetSponsorByID(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, sponsor)
}

// router.PUT(baseURL+"/sponsors/:id", wrapper.PutSponsorsId)
func (h *Handler) PutSponsorsId(c echo.Context) error {
	id := c.Param("id")
	sponsor := new(domain.Sponsor)
	if err := c.Bind(sponsor); err != nil {
		return err
	}

	updatedSponsor, err := h.sponsorUseCase.UpdateSponsor(c.Request().Context(), id,
		sponsor.Name,
		sponsor.Tel,
		sponsor.Email,
		sponsor.Address,
		sponsor.Representative,
	)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, updatedSponsor)
}
