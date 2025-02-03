package handler

import (
	"net/http"

	"github.com/NUTFes/FinanSu/api/generated"
	"github.com/labstack/echo/v4"
)

// router.GET(baseURL+"/festival_items", wrapper.GetFestivalItems)
func (h *Handler) GetFestivalItems(c echo.Context) error {
	ctx := c.Request().Context()
	year := c.QueryParam("year")
	divisionId := c.QueryParam("division_id")
	var festivalItemDetails FestivalItemDetails

	festivalItemDetails, err := h.festivalItemUseCase.GetFestivalItems(ctx, year, divisionId)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, festivalItemDetails)
}

// router.POST(baseURL+"/festival_items", wrapper.PostFestivalItems)
func (h *Handler) PostFestivalItems(c echo.Context) error {
	ctx := c.Request().Context()
	festivalItem := new(FestivalItem)

	if err := c.Bind(festivalItem); err != nil {
		return c.String(http.StatusBadRequest, "Bad Request")
	}

	latestFestivalItem, err := h.festivalItemUseCase.CreateFestivalItem(ctx, *festivalItem)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, latestFestivalItem)
}

// router.GET(baseURL+"/festival_items/details/:user_id", wrapper.GetFestivalItemsDetailsUserId)
func (h *Handler) GetFestivalItemsDetailsUserId(c echo.Context) error {
	ctx := c.Request().Context()
	userId := c.Param("user_id")
	year := c.QueryParam("year")
	var festivalItemDetails []FestivalItemsForMyPage

	festivalItemDetails, err := h.festivalItemUseCase.GetFestivalItemsForMypage(ctx, year, userId)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, festivalItemDetails)
}

// router.DELETE(baseURL+"/festival_items/:id", wrapper.DeleteFestivalItemsId)
func (h *Handler) DeleteFestivalItemsId(c echo.Context) error {
	ctx := c.Request().Context()
	id := c.Param("id")

	err := h.festivalItemUseCase.DestroyFestivalItem(ctx, id)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Destroy Festival Item")
}

// router.PUT(baseURL+"/festival_items/:id", wrapper.PutFestivalItemsId)
func (h *Handler) PutFestivalItemsId(c echo.Context) error {
	ctx := c.Request().Context()
	id := c.Param("id")
	festivalItem := new(FestivalItem)

	if err := c.Bind(festivalItem); err != nil {
		return c.String(http.StatusBadRequest, "Bad Request")
	}

	updatedFestivalItem, err := h.festivalItemUseCase.UpdateFestivalItem(ctx, id, *festivalItem)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, updatedFestivalItem)
}

type FestivalItemDetails = generated.FestivalItemDetails
type FestivalItem = generated.FestivalItem
type FestivalItemsForMyPage = generated.FestivalItemsForMyPage
