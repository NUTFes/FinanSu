package handler

import (
	"net/http"

	"github.com/NUTFes/FinanSu/api/generated"
	"github.com/labstack/echo/v4"
)

// 一覧取得 (Get ALL)
func (h *Handler) GetSponsorshipActivities(c echo.Context, sponsorshipActivitiesSearchParams generated.GetSponsorshipActivitiesParams) error {

	// 絞り込み・ソート条件を元に協賛活動を一覧取得
	retrievedSponsorshipActivities, err := h.sponsorshipActivityUseCase.GetSponsorshipActivities(c.Request().Context(), sponsorshipActivitiesSearchParams)
	if err != nil {
		return err
	}

	// 合計金額の計算
	totalAmountOfSponsorStyles := 0
	for _, currentSponsorshipActivity := range retrievedSponsorshipActivities {
		if currentSponsorshipActivity.SponsorStyles != nil {
			for _, currentSponsorStyleLink := range *currentSponsorshipActivity.SponsorStyles {
				if currentSponsorStyleLink.Style != nil {
					totalAmountOfSponsorStyles += currentSponsorStyleLink.Style.Price
				}
			}
		}
	}

	// レスポンスの作成
	sponsorshipActivitiesResponse := generated.SponsorshipActivitiesResponse{
		TotalAmount: &totalAmountOfSponsorStyles,
		Activities:  &retrievedSponsorshipActivities,
	}

	return c.JSON(http.StatusOK, sponsorshipActivitiesResponse)
}

// 作成 (Post)
func (h *Handler) PostSponsorshipActivities(c echo.Context) error {
	var createSponsorshipActivityRequest generated.CreateSponsorshipActivityRequest

	// JSONデータの読み取り
	if err := c.Bind(&createSponsorshipActivityRequest); err != nil {
		return err
	}

	// 登録
	createdSponsorshipActivity, err := h.sponsorshipActivityUseCase.CreateSponsorshipActivity(c.Request().Context(), createSponsorshipActivityRequest)
	if err != nil {
		return err
	}

	// レスポンス
	return c.JSON(http.StatusCreated, createdSponsorshipActivity)
}

// 詳細 (Get ID)
func (h *Handler) GetSponsorshipActivitiesId(c echo.Context, sponsorshipActivityId int) error {
	sponsorshipActivityByID, err := h.sponsorshipActivityUseCase.GetSponsorshipActivityByID(c.Request().Context(), sponsorshipActivityId)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, sponsorshipActivityByID)
}

// 更新 (Put: 全項目更新)
func (h *Handler) PutSponsorshipActivitiesId(c echo.Context, id int) error {
	var req generated.PutSponsorshipActivitiesIdJSONRequestBody

	if err := c.Bind(&req); err != nil {
		return err
	}

	updatedSponsorshipActivity, err := h.sponsorshipActivityUseCase.UpdateSponsorshipActivity(c.Request().Context(), id, req)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, updatedSponsorshipActivity)
}

// ステータス更新 (Put: Status)
func (h *Handler) PutSponsorshipActivitiesIdStatus(c echo.Context, id int) error {
	var req generated.PutSponsorshipActivitiesIdStatusJSONRequestBody
	if err := c.Bind(&req); err != nil {
		return c.String(http.StatusBadRequest, "Bad Request")
	}

	updated, err := h.sponsorshipActivityUseCase.UpdateSponsorshipActivityStatus(c.Request().Context(), id, req)
	if err != nil {
		return c.String(http.StatusInternalServerError, "failed to update status")
	}

	return c.JSON(http.StatusOK, updated)
}

// 削除 (Delete)
func (h *Handler) DeleteSponsorshipActivitiesId(c echo.Context, id int) error {
	err := h.sponsorshipActivityUseCase.DeleteSponsorshipActivity(c.Request().Context(), id)
	if err != nil {
		return c.String(http.StatusInternalServerError, "failed to delete sponsorship activity")
	}
	return c.JSON(http.StatusOK, "Deleted")
}

// CSVエクスポート
func (h *Handler) GetSponsorshipActivitiesExport(c echo.Context, params generated.GetSponsorshipActivitiesExportParams) error {
	return c.String(http.StatusOK, "GetSponsorshipActivitiesExport: Mock Response")
}
