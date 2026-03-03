package handler

import (
	"net/http"
	"time"

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

	genActivities := make([]generated.SponsorshipActivity, 0, len(activities))
	totalAmount := 0

	for _, a := range activities {
		genAct := convertToGeneratedSponsorshipActivity(a)
		genActivities = append(genActivities, genAct)
		for _, s := range a.SponsorStyles {
			totalAmount += s.Style.Price
		}
	}
	response := map[string]interface{}{
		"totalAmount": totalAmount,
		"activities":  genActivities,
	}

	return c.JSON(http.StatusOK, response)
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

func convertToGeneratedSponsorshipActivity(a domain.SponsorshipActivity) generated.SponsorshipActivity {
	id, ypID, spID, uID := a.ID, a.YearPeriodsID, a.SponsorID, a.UserID
	actStatus := generated.ActivityStatus(a.ActivityStatus)
	feasStatus := generated.FeasibilityStatus(a.FeasibilityStatus)
	designProg := generated.DesignProgress(a.DesignProgress)
	remarks, createdAt, updatedAt := a.Remarks, a.CreatedAt, a.UpdatedAt

	// 企業の変換
	var genSponsor *generated.Sponsor
	if a.Sponsor.ID != 0 {
		sId, sName, sTel := a.Sponsor.ID, a.Sponsor.Name, a.Sponsor.Tel
		sEmail, sAddr, sRep := a.Sponsor.Email, a.Sponsor.Address, a.Sponsor.Representative
		genSponsor = &generated.Sponsor{
			Id: &sId, Name: sName, Tel: sTel, Email: sEmail, Address: sAddr, Representative: sRep,
		}
	}

	// 担当者の変換
	var genUser *generated.User
	if a.User.ID != 0 {
		uId, uName, uBur, uRole := a.User.ID, a.User.Name, a.User.BureauID, a.User.RoleID
		uIsDel := a.User.IsDeleted

		uCreatedAt := a.User.CreatedAt.Format(time.RFC3339)
		uUpdatedAt := a.User.UpdatedAt.Format(time.RFC3339)

		genUser = &generated.User{
			Id: uId, Name: uName, BureauID: uBur, RoleID: uRole, IsDeleted: uIsDel,
			CreatedAt: uCreatedAt, UpdatedAt: uUpdatedAt,
		}
	}

	// プランの変換
	genStyles := make([]generated.ActivitySponsorStyleLink, 0)
	for _, s := range a.SponsorStyles {
		lId, ssId, cat := s.ID, s.SponsorStyleID, s.Category
		styleStr, feat, price := s.Style.Style, s.Style.Feature, s.Style.Price

		catEnum := generated.ActivitySponsorStyleLinkCategory(cat)

		genStyleInfo := generated.SponsorStyle{
			Style: styleStr, Feature: feat, Price: price,
		}

		genStyles = append(genStyles, generated.ActivitySponsorStyleLink{
			Id: &lId, SponsorStyleId: &ssId, Category: &catEnum, Style: &genStyleInfo,
		})
	}

	return generated.SponsorshipActivity{
		Id:                &id,
		YearPeriodsId:     &ypID,
		SponsorId:         &spID,
		UserId:            &uID,
		ActivityStatus:    &actStatus,
		FeasibilityStatus: &feasStatus,
		DesignProgress:    &designProg,
		Remarks:           &remarks,
		CreatedAt:         &createdAt,
		UpdatedAt:         &updatedAt,
		Sponsor:           genSponsor,
		User:              genUser,
		SponsorStyles:     &genStyles,
	}
}
