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
	GetActivities(context.Context) ([]domain.Activity, error)
	GetActivityByID(context.Context, string) (domain.Activity, error)
	CreateActivity(context.Context, string, string, string, string) error
	UpdateActivity(context.Context, string, string, string, string, string) error
	DestroyActivity(context.Context, string) error
	GetActivitiesWithSponsorAndStyle(context.Context) ([]domain.ActivityForAdminView, error) 
}

func NewActivityUseCase(rep rep.ActivityRepository) ActivityUseCase {
	return &activityUseCase{rep}
}

func (a *activityUseCase) GetActivities(c context.Context) ([]domain.Activity, error) {

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
			&activity.SponsorStyleID,
			&activity.UserID,
			&activity.IsDone,
			&activity.SponsorID,
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
		&activity.SponsorStyleID,
		&activity.UserID,
		&activity.IsDone,
		&activity.SponsorID,
		&activity.CreatedAt,
		&activity.UpdatedAt,
	)

	if err != nil {
		return activity, err
	}

	return activity, nil
}

func (a *activityUseCase) CreateActivity(c context.Context, sponsorStyleID string, userID string, isDone string, sponsorID string) error {
	err := a.rep.Create(c, sponsorStyleID, userID, isDone, sponsorID)
	return err
}

func (a *activityUseCase) UpdateActivity(c context.Context, id string, sponsorStyleID string, userID string, isDone string, sponsorID string) error {
	err := a.rep.Update(c, id, sponsorStyleID, userID, isDone, sponsorID)
	return err
}

func (a *activityUseCase) DestroyActivity(c context.Context, id string) error {
	err := a.rep.Destroy(c, id)
	return err
}

func (a *activityUseCase) GetActivitiesWithSponsorAndStyle(c context.Context) ([]domain.ActivityForAdminView, error) {

	activity := domain.ActivityForAdminView{}
	var activities []domain.ActivityForAdminView

	// クエリー実行
	rows, err := a.rep.AllWithSponsor(c)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		err := rows.Scan(
			&activity.Activity.ID,
			&activity.Activity.SponsorStyleID,
			&activity.Activity.UserID,
			&activity.Activity.IsDone,
			&activity.Activity.SponsorID,
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
			&activity.SponsorStyle.Scale,
			&activity.SponsorStyle.IsColor,
			&activity.SponsorStyle.Price,
			&activity.SponsorStyle.CreatedAt,
			&activity.SponsorStyle.UpdatedAt,
			&activity.User.ID,
			&activity.User.Name,
			&activity.User.DepartmentID,
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