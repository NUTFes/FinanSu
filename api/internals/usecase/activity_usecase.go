package usecase

import (
	"context"
	"log"
	"strconv"

	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/pkg/errors"
)

type activityUseCase struct {
	rep rep.ActivityRepository
}

type ActivityUseCase interface {
	GetActivity(context.Context) ([]domain.Activity, error)
	GetActivityByID(context.Context, string) (domain.Activity, error)
	CreateActivity(context.Context, string, string, string, string, string, string, string, string) (domain.Activity, error)
	UpdateActivity(context.Context, string, string, string, string, string, string, string, string, string) (domain.Activity, error)
	DestroyActivity(context.Context, string) error
	GetActivityDetail(context.Context) ([]domain.ActivityDetail, error)
	GetActivityDetailsByPeriod(context.Context, string) ([]domain.ActivityDetail, error)
	GetFilteredActivityDetail(context.Context, string, []string, string) ([]domain.ActivityDetail, error)
	GetFilteredActivityDetailByPeriod(context.Context, string, []string, string, string) ([]domain.ActivityDetail, error)
}

func NewActivityUseCase(rep rep.ActivityRepository) ActivityUseCase {
	return &activityUseCase{rep}
}

func (a *activityUseCase) GetActivity(c context.Context) ([]domain.Activity, error) {

	activity := domain.Activity{}
	var activities []domain.Activity

	// クエリー実行
	rows, err := a.rep.All(c)
	if err != nil {
		return nil, err
	}
	defer func() {
		if err := rows.Close(); err != nil {
			log.Println(err)
		}
	}()

	for rows.Next() {
		err := rows.Scan(
			&activity.ID,
			&activity.UserID,
			&activity.IsDone,
			&activity.SponsorID,
			&activity.Feature,
			&activity.Expense,
			&activity.Remark,
			&activity.Design,
			&activity.Url,
			&activity.CreatedAt,
			&activity.UpdatedAt,
		)

		if err != nil {
			return nil, errors.Wrapf(err, "cannot connect SQL")
		}

		activities = append(activities, activity)
	}
	return activities, nil
}

func (a *activityUseCase) GetActivityByID(c context.Context, id string) (domain.Activity, error) {
	var activity domain.Activity

	row, err := a.rep.Find(c, id)
	if err != nil {
		return activity, err
	}

	err = row.Scan(
		&activity.ID,
		&activity.UserID,
		&activity.IsDone,
		&activity.SponsorID,
		&activity.Feature,
		&activity.Expense,
		&activity.Remark,
		&activity.Design,
		&activity.Url,
		&activity.CreatedAt,
		&activity.UpdatedAt,
	)

	if err != nil {
		return activity, err
	}

	return activity, nil
}

func (a *activityUseCase) CreateActivity(
	c context.Context,
	userID string,
	isDone string,
	sponsorID string,
	feature string,
	expense string,
	remark string,
	design string,
	url string) (domain.Activity, error) {
	latestActivity := domain.Activity{}

	err := a.rep.Create(c, userID, isDone, sponsorID, feature, expense, remark, design, url)
	if err != nil {
		return latestActivity, err
	}
	row, err := a.rep.FindLatestRecord(c)
	if err != nil {
		return latestActivity, err
	}

	err = row.Scan(
		&latestActivity.ID,
		&latestActivity.UserID,
		&latestActivity.IsDone,
		&latestActivity.SponsorID,
		&latestActivity.Feature,
		&latestActivity.Expense,
		&latestActivity.Remark,
		&latestActivity.Design,
		&latestActivity.Url,
		&latestActivity.CreatedAt,
		&latestActivity.UpdatedAt,
	)
	if err != nil {
		return latestActivity, err
	}

	return latestActivity, nil
}

func (a *activityUseCase) UpdateActivity(
	c context.Context,
	id string,
	userID string,
	isDone string,
	sponsorID string,
	feature string,
	expense string,
	remark string,
	design string,
	url string) (domain.Activity, error) {
	updatedActivity := domain.Activity{}
	err := a.rep.Update(c, id, userID, isDone, sponsorID, feature, expense, remark, design, url)
	if err != nil {
		return updatedActivity, err
	}
	row, err := a.rep.Find(c, id)
	if err != nil {
		return updatedActivity, err
	}

	err = row.Scan(
		&updatedActivity.ID,
		&updatedActivity.UserID,
		&updatedActivity.IsDone,
		&updatedActivity.SponsorID,
		&updatedActivity.Feature,
		&updatedActivity.Expense,
		&updatedActivity.Remark,
		&updatedActivity.Design,
		&updatedActivity.Url,
		&updatedActivity.CreatedAt,
		&updatedActivity.UpdatedAt,
	)
	if err != nil {
		return updatedActivity, err
	}
	return updatedActivity, nil
}

func (a *activityUseCase) DestroyActivity(c context.Context, id string) error {
	err := a.rep.Destroy(c, id)
	return err
}

func (a *activityUseCase) GetActivityDetail(c context.Context) ([]domain.ActivityDetail, error) {

	activity := domain.ActivityDetail{}
	var activities []domain.ActivityDetail
	styleDetail := domain.StyleDetail{}
	var styleDetails []domain.StyleDetail
	activityInformation := domain.ActivityInformation{}
	var activityInformations []domain.ActivityInformation

	// クエリー実行
	rows, err := a.rep.FindDetail(c)
	if err != nil {
		return nil, err
	}
	defer func() {
		if err := rows.Close(); err != nil {
			log.Println(err)
		}
	}()

	for rows.Next() {
		err := rows.Scan(
			&activity.Activity.ID,
			&activity.Activity.UserID,
			&activity.Activity.IsDone,
			&activity.Activity.SponsorID,
			&activity.Activity.Feature,
			&activity.Activity.Expense,
			&activity.Activity.Remark,
			&activity.Activity.Design,
			&activity.Activity.Url,
			&activity.Activity.CreatedAt,
			&activity.Activity.UpdatedAt,
			&activity.Sponsor.ID,
			&activity.Sponsor.Name,
			&activity.Sponsor.Tel,
			&activity.Sponsor.Email,
			&activity.Sponsor.Address,
			&activity.Sponsor.Representative,
			&activity.Sponsor.CreatedAt,
			&activity.Sponsor.UpdatedAt,
			&activity.User.ID,
			&activity.User.Name,
			&activity.User.BureauID,
			&activity.User.RoleID,
			&activity.User.IsDeleted,
			&activity.User.CreatedAt,
			&activity.User.UpdatedAt,
		)
		if err != nil {
			return nil, errors.Wrapf(err, "cannot connect SQL")
		}

		rows, err := a.rep.FindActivityInformation(c, strconv.Itoa(int(activity.Activity.ID)))
		if err != nil {
			return nil, err
		}

		for rows.Next() {
			err := rows.Scan(
				&activityInformation.ID,
				&activityInformation.ActivityId,
				&activityInformation.BucketName,
				&activityInformation.FileName,
				&activityInformation.FileType,
				&activityInformation.DesignProgress,
				&activityInformation.FileInformation,
				&activityInformation.CreatedAt,
				&activityInformation.UpdatedAt,
			)
			if err != nil {
				return nil, err
			}
			activityInformations = append(activityInformations, activityInformation)
		}
		activity.ActivityInformation = activityInformations
		activityInformations = nil

		rows, err = a.rep.FindSponsorStyle(c, strconv.Itoa(int(activity.Activity.ID)))
		if err != nil {
			return nil, err
		}

		for rows.Next() {
			err := rows.Scan(
				&styleDetail.ActivityStyle.ID,
				&styleDetail.ActivityStyle.ActivityID,
				&styleDetail.ActivityStyle.SponsoStyleID,
				&styleDetail.ActivityStyle.CreatedAt,
				&styleDetail.ActivityStyle.UpdatedAt,
				&styleDetail.SponsorStyle.ID,
				&styleDetail.SponsorStyle.Style,
				&styleDetail.SponsorStyle.Feature,
				&styleDetail.SponsorStyle.Price,
				&styleDetail.SponsorStyle.IsDeleted,
				&styleDetail.SponsorStyle.CreatedAt,
				&styleDetail.SponsorStyle.UpdatedAt,
			)
			if err != nil {
				return nil, err
			}
			styleDetails = append(styleDetails, styleDetail)
		}
		activity.StyleDetail = styleDetails
		activities = append(activities, activity)
		styleDetails = nil
	}
	return activities, nil
}

func (a *activityUseCase) GetActivityDetailsByPeriod(c context.Context, year string) ([]domain.ActivityDetail, error) {
	activity := domain.ActivityDetail{}
	var activities []domain.ActivityDetail
	styleDetail := domain.StyleDetail{}
	var styleDetails []domain.StyleDetail
	activityInformation := domain.ActivityInformation{}
	var activityInformations []domain.ActivityInformation

	// クエリー実行
	rows, err := a.rep.AllDetailsByPeriod(c, year)
	if err != nil {
		return nil, err
	}
	defer func() {
		if err := rows.Close(); err != nil {
			log.Println(err)
		}
	}()

	for rows.Next() {
		err := rows.Scan(
			&activity.Activity.ID,
			&activity.Activity.UserID,
			&activity.Activity.IsDone,
			&activity.Activity.SponsorID,
			&activity.Activity.Feature,
			&activity.Activity.Expense,
			&activity.Activity.Remark,
			&activity.Activity.Design,
			&activity.Activity.Url,
			&activity.Activity.CreatedAt,
			&activity.Activity.UpdatedAt,
			&activity.Sponsor.ID,
			&activity.Sponsor.Name,
			&activity.Sponsor.Tel,
			&activity.Sponsor.Email,
			&activity.Sponsor.Address,
			&activity.Sponsor.Representative,
			&activity.Sponsor.CreatedAt,
			&activity.Sponsor.UpdatedAt,
			&activity.User.ID,
			&activity.User.Name,
			&activity.User.BureauID,
			&activity.User.RoleID,
			&activity.User.IsDeleted,
			&activity.User.CreatedAt,
			&activity.User.UpdatedAt,
		)
		if err != nil {
			return nil, errors.Wrapf(err, "cannot connect SQL")
		}

		rows, err := a.rep.FindActivityInformation(c, strconv.Itoa(int(activity.Activity.ID)))
		if err != nil {
			return nil, err
		}
		for rows.Next() {
			err := rows.Scan(
				&activityInformation.ID,
				&activityInformation.ActivityId,
				&activityInformation.BucketName,
				&activityInformation.FileName,
				&activityInformation.FileType,
				&activityInformation.DesignProgress,
				&activityInformation.FileInformation,
				&activityInformation.CreatedAt,
				&activityInformation.UpdatedAt,
			)
			if err != nil {
				return nil, err
			}
			activityInformations = append(activityInformations, activityInformation)
		}
		activity.ActivityInformation = activityInformations
		activityInformations = nil

		rows, err = a.rep.FindSponsorStyle(c, strconv.Itoa(int(activity.Activity.ID)))
		if err != nil {
			return nil, err
		}
		for rows.Next() {
			err := rows.Scan(
				&styleDetail.ActivityStyle.ID,
				&styleDetail.ActivityStyle.ActivityID,
				&styleDetail.ActivityStyle.SponsoStyleID,
				&styleDetail.ActivityStyle.CreatedAt,
				&styleDetail.ActivityStyle.UpdatedAt,
				&styleDetail.SponsorStyle.ID,
				&styleDetail.SponsorStyle.Style,
				&styleDetail.SponsorStyle.Feature,
				&styleDetail.SponsorStyle.Price,
				&styleDetail.SponsorStyle.IsDeleted,
				&styleDetail.SponsorStyle.CreatedAt,
				&styleDetail.SponsorStyle.UpdatedAt,
			)
			if err != nil {
				return nil, err
			}
			styleDetails = append(styleDetails, styleDetail)
		}
		activity.StyleDetail = styleDetails
		activities = append(activities, activity)
		styleDetails = nil
	}
	return activities, nil
}

func (a *activityUseCase) GetFilteredActivityDetail(c context.Context, isDone string, sponsorStyleIDs []string, keyword string) ([]domain.ActivityDetail, error) {
	activity := domain.ActivityDetail{}
	var activities []domain.ActivityDetail
	styleDetail := domain.StyleDetail{}
	var styleDetails []domain.StyleDetail
	activityInformation := domain.ActivityInformation{}
	var activityInformations []domain.ActivityInformation

	// クエリー実行
	rows, err := a.rep.FindFilteredDetail(c, isDone, sponsorStyleIDs, keyword)
	if err != nil {
		return nil, err
	}
	defer func() {
		if err := rows.Close(); err != nil {
			log.Println(err)
		}
	}()

	for rows.Next() {
		err := rows.Scan(
			&activity.Activity.ID,
			&activity.Activity.UserID,
			&activity.Activity.IsDone,
			&activity.Activity.SponsorID,
			&activity.Activity.Feature,
			&activity.Activity.Expense,
			&activity.Activity.Remark,
			&activity.Activity.Design,
			&activity.Activity.Url,
			&activity.Activity.CreatedAt,
			&activity.Activity.UpdatedAt,
			&activity.Sponsor.ID,
			&activity.Sponsor.Name,
			&activity.Sponsor.Tel,
			&activity.Sponsor.Email,
			&activity.Sponsor.Address,
			&activity.Sponsor.Representative,
			&activity.Sponsor.CreatedAt,
			&activity.Sponsor.UpdatedAt,
			&activity.User.ID,
			&activity.User.Name,
			&activity.User.BureauID,
			&activity.User.RoleID,
			&activity.User.IsDeleted,
			&activity.User.CreatedAt,
			&activity.User.UpdatedAt,
		)
		if err != nil {
			return nil, errors.Wrapf(err, "cannot connect SQL")
		}

		rows, err := a.rep.FindActivityInformation(c, strconv.Itoa(int(activity.Activity.ID)))
		if err != nil {
			return nil, err
		}

		for rows.Next() {
			err := rows.Scan(
				&activityInformation.ID,
				&activityInformation.ActivityId,
				&activityInformation.BucketName,
				&activityInformation.FileName,
				&activityInformation.FileType,
				&activityInformation.DesignProgress,
				&activityInformation.FileInformation,
				&activityInformation.CreatedAt,
				&activityInformation.UpdatedAt,
			)
			if err != nil {
				return nil, err
			}
			activityInformations = append(activityInformations, activityInformation)
		}
		activity.ActivityInformation = activityInformations
		activityInformations = nil

		rows, err = a.rep.FindSponsorStyle(c, strconv.Itoa(int(activity.Activity.ID)))
		if err != nil {
			return nil, err
		}

		for rows.Next() {
			err := rows.Scan(
				&styleDetail.ActivityStyle.ID,
				&styleDetail.ActivityStyle.ActivityID,
				&styleDetail.ActivityStyle.SponsoStyleID,
				&styleDetail.ActivityStyle.CreatedAt,
				&styleDetail.ActivityStyle.UpdatedAt,
				&styleDetail.SponsorStyle.ID,
				&styleDetail.SponsorStyle.Style,
				&styleDetail.SponsorStyle.Feature,
				&styleDetail.SponsorStyle.Price,
				&styleDetail.SponsorStyle.IsDeleted,
				&styleDetail.SponsorStyle.CreatedAt,
				&styleDetail.SponsorStyle.UpdatedAt,
			)
			if err != nil {
				return nil, err
			}
			styleDetails = append(styleDetails, styleDetail)
		}
		activity.StyleDetail = styleDetails
		activities = append(activities, activity)
		styleDetails = nil
	}
	return activities, nil
}

func (a *activityUseCase) GetFilteredActivityDetailByPeriod(c context.Context, isDone string, sponsorStyleIDs []string, year string, keyword string) ([]domain.ActivityDetail, error) {
	activity := domain.ActivityDetail{}
	var activities []domain.ActivityDetail
	styleDetail := domain.StyleDetail{}
	var styleDetails []domain.StyleDetail
	activityInformation := domain.ActivityInformation{}
	var activityInformations []domain.ActivityInformation

	// クエリー実行
	rows, err := a.rep.FindFilteredDetailByPeriod(c, isDone, sponsorStyleIDs, year, keyword)
	if err != nil {
		return nil, err
	}
	defer func() {
		if err := rows.Close(); err != nil {
			log.Println(err)
		}
	}()

	for rows.Next() {
		err := rows.Scan(
			&activity.Activity.ID,
			&activity.Activity.UserID,
			&activity.Activity.IsDone,
			&activity.Activity.SponsorID,
			&activity.Activity.Feature,
			&activity.Activity.Expense,
			&activity.Activity.Remark,
			&activity.Activity.Design,
			&activity.Activity.Url,
			&activity.Activity.CreatedAt,
			&activity.Activity.UpdatedAt,
			&activity.Sponsor.ID,
			&activity.Sponsor.Name,
			&activity.Sponsor.Tel,
			&activity.Sponsor.Email,
			&activity.Sponsor.Address,
			&activity.Sponsor.Representative,
			&activity.Sponsor.CreatedAt,
			&activity.Sponsor.UpdatedAt,
			&activity.User.ID,
			&activity.User.Name,
			&activity.User.BureauID,
			&activity.User.RoleID,
			&activity.User.IsDeleted,
			&activity.User.CreatedAt,
			&activity.User.UpdatedAt,
		)
		if err != nil {
			return nil, errors.Wrapf(err, "cannot connect SQL")
		}

		rows, err := a.rep.FindActivityInformation(c, strconv.Itoa(int(activity.Activity.ID)))
		if err != nil {
			return nil, err
		}

		for rows.Next() {
			err := rows.Scan(
				&activityInformation.ID,
				&activityInformation.ActivityId,
				&activityInformation.BucketName,
				&activityInformation.FileName,
				&activityInformation.FileType,
				&activityInformation.DesignProgress,
				&activityInformation.FileInformation,
				&activityInformation.CreatedAt,
				&activityInformation.UpdatedAt,
			)
			if err != nil {
				return nil, err
			}
			activityInformations = append(activityInformations, activityInformation)
		}
		activity.ActivityInformation = activityInformations
		activityInformations = nil

		rows, err = a.rep.FindSponsorStyle(c, strconv.Itoa(int(activity.Activity.ID)))
		if err != nil {
			return nil, err
		}

		for rows.Next() {
			err := rows.Scan(
				&styleDetail.ActivityStyle.ID,
				&styleDetail.ActivityStyle.ActivityID,
				&styleDetail.ActivityStyle.SponsoStyleID,
				&styleDetail.ActivityStyle.CreatedAt,
				&styleDetail.ActivityStyle.UpdatedAt,
				&styleDetail.SponsorStyle.ID,
				&styleDetail.SponsorStyle.Style,
				&styleDetail.SponsorStyle.Feature,
				&styleDetail.SponsorStyle.Price,
				&styleDetail.SponsorStyle.IsDeleted,
				&styleDetail.SponsorStyle.CreatedAt,
				&styleDetail.SponsorStyle.UpdatedAt,
			)
			if err != nil {
				return nil, err
			}
			styleDetails = append(styleDetails, styleDetail)
		}
		activity.StyleDetail = styleDetails
		activities = append(activities, activity)
		styleDetails = nil
	}
	return activities, nil
}
