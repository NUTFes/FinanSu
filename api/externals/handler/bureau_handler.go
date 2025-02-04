package handler

import (
	"net/http"
	"strconv"

	"github.com/NUTFes/FinanSu/api/generated"
	"github.com/labstack/echo/v4"
)

// router.GET(baseURL+"/bureaus", wrapper.GetBureaus)
func (h *Handler) GetBureaus(c echo.Context) error {
	bureaus, err := h.bureauUseCase.GetBureaus(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, bureaus)
}

// router.POST(baseURL+"/bureaus", wrapper.PostBureaus)
func (h *Handler) PostBureaus(c echo.Context, params generated.PostBureausParams) error {
	name := params.Name
	latastBureau, err := h.bureauUseCase.CreateBureau(c.Request().Context(),
		name,
	)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, latastBureau)
}

// router.DELETE(baseURL+"/bureaus/:id", wrapper.DeleteBureausId)
func (h *Handler) DeleteBureausId(c echo.Context, id int) error {
	idStr := strconv.Itoa(id)
	err := h.bureauUseCase.DestroyBureau(c.Request().Context(), idStr)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, "Destroy Bureau")
}

// router.GET(baseURL+"/bureaus/:id", wrapper.GetBureausId)
func (h *Handler) GetBureausId(c echo.Context, id int) error {
	idStr := strconv.Itoa(id)
	bureau, err := h.bureauUseCase.GetBureauByID(c.Request().Context(), idStr)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, bureau)
}

// router.PUT(baseURL+"/bureaus/:id", wrapper.PutBureausId)
func (h *Handler) PutBureausId(c echo.Context, id int, params generated.PutBureausIdParams) error {
	idStr := strconv.Itoa(id)
	name := *params.Name
	updatedBureau, err := h.bureauUseCase.UpdateBureau(c.Request().Context(), idStr, name)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, updatedBureau)
}
