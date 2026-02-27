package handler

import (
	"net/http"

	"github.com/NUTFes/FinanSu/api/generated"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/labstack/echo/v4"
)

// 一覧取得 (Get ALL)
func (h *Handler) GetSponsorshipActivities(c echo.Context, params generated.GetSponsorshipActivitiesParams) error {
	// Domainの型に詰め替え
	dp := domain.SponsorshipActivityParams{
		YearPeriodsID: params.YearPeriodsId,
		Keyword:       params.Keyword,
		UserID:        params.UserId,
	}

	// Enumや文字列をキャストしてセット
	if params.ActivityStatus != nil {
		status := string(*params.ActivityStatus)
		dp.ActivityStatus = &status
	}
	if params.FeasibilityStatus != nil {
		status := string(*params.FeasibilityStatus)
		dp.FeasibilityStatus = &status
	}
	if params.Sort != nil {
		dp.Sort = params.Sort
	}
	if params.Order != nil {
		order := string(*params.Order)
		dp.Order = &order
	}
	// 協賛プランID（配列）
	if params.SponsorStyleIds != nil {
		dp.SponsorStyleIDs = *params.SponsorStyleIds
	}

	// データ取得
	activities, err := h.sponsorshipActivityUseCase.GetSponsorshipActivities(c.Request().Context(), dp)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, activities)
}

// 作成 (Post)
func (h *Handler) PostSponsorshipActivities(c echo.Context) error {
	return c.String(http.StatusOK, "PostSponsorshipActivities: Mock Response")
}

// 詳細 (Get ID)
func (h *Handler) GetSponsorshipActivitiesId(c echo.Context, id int) error {
	return c.String(http.StatusOK, "GetSponsorshipActivitiesId: Mock Response")
}

// 更新 (Put: 全項目更新)
func (h *Handler) PutSponsorshipActivitiesId(c echo.Context, id int) error {
	return c.String(http.StatusOK, "PutSponsorshipActivitiesId: Mock Response")
}

// ステータス更新 (Put: Status)
func (h *Handler) PutSponsorshipActivitiesIdStatus(c echo.Context, id int) error {
	return c.String(http.StatusOK, "PutSponsorshipActivitiesIdStatus: Mock Response")
}

// 削除 (Delete)
func (h *Handler) DeleteSponsorshipActivitiesId(c echo.Context, id int) error {
	return c.String(http.StatusOK, "DeleteSponsorshipActivitiesId: Mock Response")
}

// CSVエクスポート
func (h *Handler) GetSponsorshipActivitiesExport(c echo.Context, params generated.GetSponsorshipActivitiesExportParams) error {
	return c.String(http.StatusOK, "GetSponsorshipActivitiesExport: Mock Response")
}
