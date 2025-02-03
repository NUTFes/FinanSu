package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// router.GET(baseURL+"/fund_informations", wrapper.GetFundInformations)
func (h *Handler) GetFundInformations(c echo.Context) error {
	fundInformations, err := h.fundInformationUseCase.GetFundInformations(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, fundInformations)
}

// router.POST(baseURL+"/fund_informations", wrapper.PostFundInformations)
func (h *Handler) PostFundInformations(c echo.Context) error {
	userID := c.QueryParam("user_id")
	teacherID := c.QueryParam("teacher_id")
	price := c.QueryParam("price")
	remark := c.QueryParam("remark")
	isFirstCheck := c.QueryParam("is_first_check")
	isLastCheck := c.QueryParam("is_last_check")
	receivedAt := c.QueryParam("received_at")

	latestFundInformation, err := h.fundInformationUseCase.CreateFundInformation(c.Request().Context(), userID, teacherID, price, remark, isFirstCheck, isLastCheck, receivedAt)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusCreated, latestFundInformation)
}

// router.GET(baseURL+"/fund_informations/details", wrapper.GetFundInformationsDetails)
func (h *Handler) GetFundInformationsDetails(c echo.Context) error {
	fundInformationDetails, err := h.fundInformationUseCase.GetFundInformationDetails(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, fundInformationDetails)
}

// router.GET(baseURL+"/fund_informations/details/:year", wrapper.GetFundInformationsDetailsYear)
func (h *Handler) GetFundInformationsDetailsYear(c echo.Context) error {
	year := c.Param("year")
	fundInformationDetails, err := h.fundInformationUseCase.GetFundInformationDetailsByPeriod(c.Request().Context(), year)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, fundInformationDetails)
}

// router.DELETE(baseURL+"/fund_informations/:id", wrapper.DeleteFundInformationsId)
func (h *Handler) DeleteFundInformationsId(c echo.Context) error {
	id := c.Param("id")
	err := h.fundInformationUseCase.DestroyFundInformation(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Destroy FundInformation")
}

// router.GET(baseURL+"/fund_informations/:id", wrapper.GetFundInformationsId)
func (h *Handler) GetFundInformationsId(c echo.Context) error {
	id := c.Param("id")
	fundInformation, err := h.fundInformationUseCase.GetFundInformationByID(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, fundInformation)
}

// router.PUT(baseURL+"/fund_informations/:id", wrapper.PutFundInformationsId)
func (h *Handler) PutFundInformationsId(c echo.Context) error {
	id := c.Param("id")
	userID := c.QueryParam("user_id")
	teacherID := c.QueryParam("teacher_id")
	price := c.QueryParam("price")
	remark := c.QueryParam("remark")
	isFirstCheck := c.QueryParam("is_first_check")
	isLastCheck := c.QueryParam("is_last_check")
	receivedAt := c.QueryParam("received_at")

	updatedFundInformation, err := h.fundInformationUseCase.UpdateFundInformation(c.Request().Context(), id, userID, teacherID, price, remark, isFirstCheck, isLastCheck, receivedAt)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, updatedFundInformation)
}

// router.GET(baseURL+"/fund_informations/:id/details", wrapper.GetFundInformationsIdDetails)
func (h *Handler) GetFundInformationsIdDetails(c echo.Context) error {
	id := c.Param("id")
	fundInformationDetail, err := h.fundInformationUseCase.GetFundInformationDetailByID(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, fundInformationDetail)
}
