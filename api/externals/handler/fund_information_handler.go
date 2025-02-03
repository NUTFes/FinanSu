package handler

import (
	"net/http"
	"strconv"

	"github.com/NUTFes/FinanSu/api/generated"
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
func (h *Handler) PostFundInformations(c echo.Context, params generated.PostFundInformationsParams) error {
	userID := strconv.Itoa(params.UserId)
	teacherID := strconv.Itoa(params.TeacherId)
	price := strconv.Itoa(params.Price)
	remark := params.Remark
	isFirstCheck := strconv.FormatBool(*params.IsFirstCheck)
	isLastCheck := strconv.FormatBool(*params.IsLastCheck)
	receivedAt := params.ReceivedAt

	latestFundInformation, err := h.fundInformationUseCase.CreateFundInformation(c.Request().Context(), userID, teacherID, price, *remark, isFirstCheck, isLastCheck, *receivedAt)
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
func (h *Handler) GetFundInformationsDetailsYear(c echo.Context, year int) error {
	yearStr := strconv.Itoa(year)
	fundInformationDetails, err := h.fundInformationUseCase.GetFundInformationDetailsByPeriod(c.Request().Context(), yearStr)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, fundInformationDetails)
}

// router.DELETE(baseURL+"/fund_informations/:id", wrapper.DeleteFundInformationsId)
func (h *Handler) DeleteFundInformationsId(c echo.Context, id int) error {
	idStr := strconv.Itoa(id)
	err := h.fundInformationUseCase.DestroyFundInformation(c.Request().Context(), idStr)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Destroy FundInformation")
}

// router.GET(baseURL+"/fund_informations/:id", wrapper.GetFundInformationsId)
func (h *Handler) GetFundInformationsId(c echo.Context, id int) error {
	idStr := strconv.Itoa(id)
	fundInformation, err := h.fundInformationUseCase.GetFundInformationByID(c.Request().Context(), idStr)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, fundInformation)
}

// router.PUT(baseURL+"/fund_informations/:id", wrapper.PutFundInformationsId)
func (h *Handler) PutFundInformationsId(c echo.Context, id int, params generated.PostFundInformationsParams) error {
	idStr := strconv.Itoa(id)
	userId := strconv.Itoa(params.UserId)
	teacherId := strconv.Itoa(params.TeacherId)
	price := strconv.Itoa(params.Price)
	remark := params.Remark
	isFirstCheck := strconv.FormatBool(*params.IsFirstCheck)
	isLastCheck := strconv.FormatBool(*params.IsLastCheck)
	receivedAt := params.ReceivedAt

	updatedFundInformation, err := h.fundInformationUseCase.UpdateFundInformation(c.Request().Context(), idStr, userId, teacherId, price, *remark, isFirstCheck, isLastCheck, *receivedAt)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, updatedFundInformation)
}

// router.GET(baseURL+"/fund_informations/:id/details", wrapper.GetFundInformationsIdDetails)
func (h *Handler) GetFundInformationsIdDetails(c echo.Context, id int) error {
	idStr := strconv.Itoa(id)
	fundInformationDetail, err := h.fundInformationUseCase.GetFundInformationDetailByID(c.Request().Context(), idStr)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, fundInformationDetail)
}
