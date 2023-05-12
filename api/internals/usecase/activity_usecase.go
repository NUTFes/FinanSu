package usecase

import (
	"context"

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
	CreateActivity(context.Context, string, string, string, string, string, string) (domain.Activity, error)
	UpdateActivity(context.Context, string, string, string, string, string, string, string) (domain.Activity, error)
	DestroyActivity(context.Context, string) error
	GetActivityDetail(context.Context) ([]domain.ActivityDetail, error)
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
	defer rows.Close()

	for rows.Next() {
		err := rows.Scan(
			&activity.ID,
			&activity.UserID,
			&activity.IsDone,
			&activity.SponsorID,
			&activity.Feature,
			&activity.Expense,
			&activity.Remark,
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
	err = row.Scan(
		&activity.ID,
		&activity.UserID,
		&activity.IsDone,
		&activity.SponsorID,
		&activity.Feature,
		&activity.Expense,
		&activity.Remark,
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
	remark string) (domain.Activity, error) {
	latastActivity := domain.Activity{}

	err := a.rep.Create(c, userID, isDone, sponsorID, feature, expense, remark)
	row, err := a.rep.FindLatestRecord(c)
	err = row.Scan(
		&latastActivity.ID,
		&latastActivity.UserID,
		&latastActivity.IsDone,
		&latastActivity.SponsorID,
		&latastActivity.Feature,
		&latastActivity.Expense,
		&latastActivity.Remark,
		&latastActivity.CreatedAt,
		&latastActivity.UpdatedAt,
	)

	if err != nil {
		return latastActivity, err
	}
	return latastActivity, nil
}

func (a *activityUseCase) UpdateActivity(
	c context.Context,
	id string,
	userID string,
	isDone string,
	sponsorID string,
	feature string,
	expense string,
	remark string) (domain.Activity, error) {
	updatedActivity := domain.Activity{}
	err := a.rep.Update(c, id, userID, isDone, sponsorID, feature, expense, remark)
	row, err := a.rep.Find(c, id)
	err = row.Scan(
		&updatedActivity.ID,
		&updatedActivity.UserID,
		&updatedActivity.IsDone,
		&updatedActivity.SponsorID,
		&updatedActivity.Feature,
		&updatedActivity.Expense,
		&updatedActivity.Remark,		
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

	// クエリー実行
	rows, err := a.rep.FindDetail(c)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		err := rows.Scan(
			&activity.Activity.ID,
			&activity.Activity.UserID,
			&activity.Activity.IsDone,
			&activity.Activity.SponsorID,
			&activity.Activity.Feature,
			&activity.Activity.Expense,
			&activity.Activity.Remark,
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
			&activity.SponsorStyle.ID,
			&activity.SponsorStyle.Style,
			&activity.SponsorStyle.Feature,
			&activity.SponsorStyle.Price,
			&activity.SponsorStyle.CreatedAt,
			&activity.SponsorStyle.UpdatedAt,
			&activity.User.ID,
			&activity.User.Name,
			&activity.User.BureauID,
			&activity.User.RoleID,
			&activity.User.CreatedAt,
			&activity.User.UpdatedAt,
		)

		if err != nil {
			return nil, errors.Wrapf(err, "cannot connect SQL")
		}

		activities = append(activities, activity)
	}
	return activities, nil
}
