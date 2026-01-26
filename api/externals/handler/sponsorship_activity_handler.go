package handler

import (
	"net/http"

	"github.com/NUTFes/FinanSu/api/generated"
	"github.com/labstack/echo/v4"
)

// 一覧取得 (Get)
func (h *Handler) GetSponsorshipActivities(c echo.Context, params generated.GetSponsorshipActivitiesParams) error {
	return c.String(http.StatusOK, "GetSponsorshipActivities: Mock Response")
}

// 作成 (Post)
func (h *Handler) PostSponsorshipActivities(c echo.Context) error {
	return c.String(http.StatusOK, "PostSponsorshipActivities: Mock Response")
}

// 詳細 (Get ID)
func (h *Handler) GetSponsorshipActivitiesId(c echo.Context, id int) error {
	return c.String(http.StatusOK, "GetSponsorshipActivitiesId: Mock Response")
}

// 更新 (Put)
func (h *Handler) PutSponsorshipActivitiesId(c echo.Context, id int) error {
	return c.String(http.StatusOK, "PutSponsorshipActivitiesId: Mock Response")
}

// 削除 (Delete)
func (h *Handler) DeleteSponsorshipActivitiesId(c echo.Context, id int) error {
	return c.String(http.StatusOK, "DeleteSponsorshipActivitiesId: Mock Response")
}

// CSVエクスポート
func (h *Handler) GetSponsorshipActivitiesExport(c echo.Context, params generated.GetSponsorshipActivitiesExportParams) error {
	return c.String(http.StatusOK, "GetSponsorshipActivitiesExport: Mock Response")
}
