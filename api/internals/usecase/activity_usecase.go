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
	GetActivitiesWithSponserAndStyle(context.Context) ([]domain.ActivityForAdminView, error) 
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
			&activity.SuponserStyleID,
			&activity.UserID,
			&activity.IsDone,
			&activity.SuponserID,
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
		&activity.SuponserStyleID,
		&activity.UserID,
		&activity.IsDone,
		&activity.SuponserID,
		&activity.CreatedAt,
		&activity.UpdatedAt,
	)

	if err != nil {
		return activity, err
	}

	return activity, nil
}

func (a *activityUseCase) CreateActivity(c context.Context, suponserStyleID string, userID string, isDone string, suponserID string) error {
	err := a.rep.Create(c, suponserStyleID, userID, isDone, suponserID)
	return err
}

func (a *activityUseCase) UpdateActivity(c context.Context, id string, suponserStyleID string, userID string, isDone string, suponserID string) error {
	err := a.rep.Update(c, id, suponserStyleID, userID, isDone, suponserID)
	return err
}

func (a *activityUseCase) DestroyActivity(c context.Context, id string) error {
	err := a.rep.Destroy(c, id)
	return err
}

func (a *activityUseCase) GetActivitiesWithSponserAndStyle(c context.Context) ([]domain.ActivityForAdminView, error) {

	activity := domain.ActivityForAdminView{}
	var activities []domain.ActivityForAdminView

	// クエリー実行
	rows, err := a.rep.AllWithSponser(c)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		err := rows.Scan(
			&activity.Activity.ID,
			&activity.Activity.SuponserStyleID,
			&activity.Activity.UserID,
			&activity.Activity.IsDone,
			&activity.Activity.SuponserID,
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