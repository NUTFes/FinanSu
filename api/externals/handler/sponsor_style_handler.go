package handler

import (
	"net/http"
	"strconv"

	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/labstack/echo/v4"
)

// router.GET(baseURL+"/sponsorstyles", wrapper.GetSponsorstyles)
func (h *Handler) GetSponsorstyles(c echo.Context) error {
	sponsorstyles, err := h.sponsorStyleUseCase.GetSponsorStyles(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, sponsorstyles)
}

// router.POST(baseURL+"/sponsorstyles", wrapper.PostSponsorstyles)
func (h *Handler) PostSponsorstyles(c echo.Context) error {
	sponsorstyle := new(domain.SponsorStyle)
	if err := c.Bind(sponsorstyle); err != nil {
		return err
	}

	latastSponsorstyle, err := h.sponsorStyleUseCase.CreateSponsorStyle(c.Request().Context(),
		sponsorstyle.Style,
		sponsorstyle.Feature,
		sponsorstyle.Price,
	)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, latastSponsorstyle)
}

// router.DELETE(baseURL+"/sponsorstyles/:id", wrapper.DeleteSponsorstylesId)
func (h *Handler) DeleteSponsorstylesId(c echo.Context, id int) error {
	idStr := strconv.Itoa(id)
	err := h.sponsorStyleUseCase.DestroySponsorStyle(c.Request().Context(), idStr)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, "Destroy Sponsorstyles")
}

// router.GET(baseURL+"/sponsorstyles/:id", wrapper.GetSponsorstylesId)
func (h *Handler) GetSponsorstylesId(c echo.Context, id int) error {
	idStr := strconv.Itoa(id)
	sponsorstyle, err := h.sponsorStyleUseCase.GetSponsorStylesByID(c.Request().Context(), idStr)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, sponsorstyle)
}

// router.PUT(baseURL+"/sponsorstyles/:id", wrapper.PutSponsorstylesId)
func (h *Handler) PutSponsorstylesId(c echo.Context, id int) error {
	idStr := strconv.Itoa(id)
	sponsorstyle := new(domain.SponsorStyle)
	if err := c.Bind(sponsorstyle); err != nil {
		return err
	}

	updatedSponsorstyle, err := h.sponsorStyleUseCase.UpdateSponsorStyle(c.Request().Context(), idStr, sponsorstyle.Style, sponsorstyle.Feature, sponsorstyle.Price)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, updatedSponsorstyle)
}
