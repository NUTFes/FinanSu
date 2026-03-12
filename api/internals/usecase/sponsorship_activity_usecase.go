package usecase

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/generated"
	"github.com/NUTFes/FinanSu/api/internals/domain"
)

type SponsorshipActivityUseCase interface {
	GetSponsorshipActivities(ctx context.Context, params generated.GetSponsorshipActivitiesParams) ([]generated.SponsorshipActivity, error)
	GetSponsorshipActivityByID(ctx context.Context, id int) (generated.SponsorshipActivity, error)
	CreateSponsorshipActivity(ctx context.Context, req generated.CreateSponsorshipActivityRequest) (generated.SponsorshipActivity, error)
	UpdateSponsorshipActivity(ctx context.Context, id int, req generated.UpdateSponsorshipActivityRequest) (generated.SponsorshipActivity, error)
	UpdateSponsorshipActivityStatus(ctx context.Context, id int, activity domain.SponsorshipActivity) (domain.SponsorshipActivity, error)
	DeleteSponsorshipActivity(ctx context.Context, id int) error
}

type sponsorshipActivityUseCase struct {
	repo            repository.SponsorshipActivityRepository
	transactionRepo repository.TransactionRepository
}

func NewSponsorshipActivityUseCase(repo repository.SponsorshipActivityRepository, transactionRepo repository.TransactionRepository) SponsorshipActivityUseCase {
	return &sponsorshipActivityUseCase{
		repo:            repo,
		transactionRepo: transactionRepo,
	}
}

func (u *sponsorshipActivityUseCase) GetSponsorshipActivities(ctx context.Context, sponsorshipActivitiesSearchParams generated.GetSponsorshipActivitiesParams) ([]generated.SponsorshipActivity, error) {
	//絞り込み・ソート条件を元に協賛活動を一覧取得
	retrievedSponsorshipActivities, err := u.repo.FindAll(ctx, sponsorshipActivitiesSearchParams)
	if err != nil || len(retrievedSponsorshipActivities) == 0 {
		return retrievedSponsorshipActivities, err
	}

	//協賛活動のIDの配列
	sponsorshipActivityIDs := make([]int, len(retrievedSponsorshipActivities))
	for index, currentSponsorshipActivity := range retrievedSponsorshipActivities {
		sponsorshipActivityIDs[index] = *currentSponsorshipActivity.Id
	}

	//IDを元に、紐づく協賛プランを取得
	sponsorStyleLinksMapBySponsorshipActivityID, err := u.repo.GetSponsorStyleMapBySponsorshipActivityIDs(ctx, sponsorshipActivityIDs)
	if err != nil {
		return nil, err
	}

	//協賛活動と協賛プランをマッピング
	for index, currentSponsorshipActivity := range retrievedSponsorshipActivities {
		if styles, exists := sponsorStyleLinksMapBySponsorshipActivityID[*currentSponsorshipActivity.Id]; exists {
			retrievedSponsorshipActivities[index].SponsorStyles = &styles
		} else {
			emptySponsorStyleLinks := []generated.ActivitySponsorStyleLink{}
			retrievedSponsorshipActivities[index].SponsorStyles = &emptySponsorStyleLinks
		}
	}

	return retrievedSponsorshipActivities, nil
}

func (u *sponsorshipActivityUseCase) GetSponsorshipActivityByID(ctx context.Context, sponsorshipActivityID int) (generated.SponsorshipActivity, error) {
	// 指定した協賛活動のデータを1件取得
	retrievedSponsorshipActivityByID, err := u.repo.FindByID(ctx, sponsorshipActivityID)
	if err != nil {
		return generated.SponsorshipActivity{}, err
	}

	// 指定IDに紐づく協賛プランを取得
	sponsorStyleMapBySponsorsshipActivityID, err := u.repo.GetSponsorStyleMapBySponsorshipActivityIDs(ctx, []int{sponsorshipActivityID})
	if err != nil {
		return generated.SponsorshipActivity{}, err
	}

	// 協賛活動と協賛プランをマッピング
	sponsorStyles, exists := sponsorStyleMapBySponsorsshipActivityID[sponsorshipActivityID]
	if exists {
		retrievedSponsorshipActivityByID.SponsorStyles = &sponsorStyles
	} else {
		emptyStyles := []generated.ActivitySponsorStyleLink{}
		retrievedSponsorshipActivityByID.SponsorStyles = &emptyStyles
	}

	return retrievedSponsorshipActivityByID, nil
}

func (u *sponsorshipActivityUseCase) CreateSponsorshipActivity(ctx context.Context, sponsorchipActivityRequestBody generated.CreateSponsorshipActivityRequest) (generated.SponsorshipActivity, error) {
	// リクエストボディからの保存用構造体を組み立て
	newSponsorshipActivity := generated.SponsorshipActivity{
		YearPeriodsId:     &sponsorchipActivityRequestBody.YearPeriodsId,
		SponsorId:         &sponsorchipActivityRequestBody.SponsorId,
		UserId:            &sponsorchipActivityRequestBody.UserId,
		ActivityStatus:    &sponsorchipActivityRequestBody.ActivityStatus,
		FeasibilityStatus: &sponsorchipActivityRequestBody.FeasibilityStatus,
		DesignProgress:    &sponsorchipActivityRequestBody.DesignProgress,
		Remarks:           sponsorchipActivityRequestBody.Remarks,
	}

	// トランザクションを開始
	tx, err := u.transactionRepo.StartTransaction(ctx)
	if err != nil {
		return generated.SponsorshipActivity{}, err
	}

	// 協賛活動を登録し、IDを取得
	newSponsorshipActivityID, err := u.repo.Create(ctx, tx, newSponsorshipActivity)
	if err != nil {
		u.transactionRepo.RollBack(ctx, tx)
		return generated.SponsorshipActivity{}, err
	}

	// 協賛プランを順番に登録
	if sponsorchipActivityRequestBody.SponsorStyleDetails != nil {
		for _, sponsorStyleDetail := range *sponsorchipActivityRequestBody.SponsorStyleDetails {
			sponsorshipStyleLink := generated.ActivitySponsorStyleLink{
				SponsorStyleId: sponsorStyleDetail.SponsorStyleId,
				Category:       sponsorStyleDetail.Category,
			}

			if err := u.repo.CreateSponsorStyleLink(ctx, tx, sponsorshipStyleLink, newSponsorshipActivityID); err != nil {
				u.transactionRepo.RollBack(ctx, tx)
				return generated.SponsorshipActivity{}, err
			}
		}
	}

	// コミット
	if err := u.transactionRepo.Commit(ctx, tx); err != nil {
		return generated.SponsorshipActivity{}, err
	}

	return u.GetSponsorshipActivityByID(ctx, newSponsorshipActivityID)
}

func (u *sponsorshipActivityUseCase) UpdateSponsorshipActivity(ctx context.Context, id int, req generated.UpdateSponsorshipActivityRequest) (generated.SponsorshipActivity, error) {
	// 1. 既存リンクを取得（トランザクション外）
	existingLinks, err := u.repo.GetSponsorStyleLinksBySponsorshipActivityID(ctx, id)
	if err != nil {
		return generated.SponsorshipActivity{}, err
	}

	// リクエストを domain.SponsorStyleLinks に変換
	requestedLinks := domain.NewSponsorStyleLinks()
	if req.SponsorStyleDetails != nil {
		for _, detail := range *req.SponsorStyleDetails {
			if detail.SponsorStyleId == nil {
				return generated.SponsorshipActivity{}, fmt.Errorf("sponsorStyleId is required")
			}
			if detail.Category == nil {
				return generated.SponsorshipActivity{}, fmt.Errorf("category is required")
			}
			cat := string(*detail.Category)
			requestedLinks = append(requestedLinks, domain.NewSponsorStyleLink(*detail.SponsorStyleId, cat))
		}
	}

	// 既存リンクとリクエストリンクの差分を計算
	toDeleteIDs, toCreate := existingLinks.Diff(requestedLinks)

	// 2. generated.UpdateSponsorshipActivityRequest → domain.SponsorshipActivity へ変換
	activity := domain.SponsorshipActivity{
		ID:                id,
		YearPeriodsID:     req.YearPeriodsId,
		SponsorID:         req.SponsorId,
		UserID:            req.UserId,
		ActivityStatus:    string(req.ActivityStatus),
		FeasibilityStatus: string(req.FeasibilityStatus),
		DesignProgress:    string(req.DesignProgress),
		Remarks:           req.Remarks,
	}

	// 3. トランザクション開始
	tx, err := u.transactionRepo.StartTransaction(ctx)
	if err != nil {
		return generated.SponsorshipActivity{}, err
	}

	err = func(tx *sql.Tx) error {
		// 4. メイン情報更新
		if err := u.repo.Update(ctx, tx, activity); err != nil {
			return err
		}

		// NOTE: 協賛スタイルの削除・追加は1リクエスト内で複数回の DELETE/INSERT をループで発行している。
		//       想定される協賛スタイル数は多くなく、現状のパフォーマンスコストは許容範囲と判断している。
		//       今後スタイル数が増加しボトルネックとなる場合は、バルク操作等による最適化を検討すること。
		// 5. 削除
		for _, linkID := range toDeleteIDs {
			if err := u.repo.DeleteSponsorStyleLinkByID(ctx, tx, linkID); err != nil {
				return err
			}
		}

		// 6. 追加
		for _, link := range toCreate {
			category := generated.SponsorStyleCategory(link.Category)
			newLink := generated.ActivitySponsorStyleLink{
				SponsorStyleId: &link.Style.ID,
				Category:       &category,
			}
			if err := u.repo.CreateSponsorStyleLink(ctx, tx, newLink, id); err != nil {
				return err
			}
		}

		// 7. コミット
		return u.transactionRepo.Commit(ctx, tx)
	}(tx)

	if err != nil {
		u.transactionRepo.RollBack(ctx, tx)
		return generated.SponsorshipActivity{}, err
	}

	return u.GetSponsorshipActivityByID(ctx, id)
}

func (u *sponsorshipActivityUseCase) UpdateSponsorshipActivityStatus(ctx context.Context, id int, activity domain.SponsorshipActivity) (domain.SponsorshipActivity, error) {
	u.repo.UpdateStatus(ctx, id, activity)
	return activity, nil
}

func (u *sponsorshipActivityUseCase) DeleteSponsorshipActivity(ctx context.Context, id int) error {
	return u.repo.Delete(ctx, id)
}
