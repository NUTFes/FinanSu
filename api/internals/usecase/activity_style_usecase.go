package usecase

import (
	"context"

	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/pkg/errors"
)

type activityStyleUseCase struct {
	rep rep.ActivityStyleRepository
}

type ActivityStyleUseCase interface {
	GetActivityStyle(context.Context) ([]domain.ActivityStyle, error)
	GetActivityStyleByID(context.Context, string) (domain.ActivityStyle, error)
	CreateActivityStyle(context.Context, string, string) (domain.ActivityStyle, error)
	UpdateActivityStyle(context.Context, string, string, string) (domain.ActivityStyle, error)
	DestroyActivityStyle(context.Context, string) error
}

func NewActivityStyleUseCase(rep rep.ActivityStyleRepository) ActivityStyleUseCase{
	return &activityStyleUseCase{rep}
}

func (a *activityStyleUseCase) GetActivityStyle(c context.Context) ([]domain.ActivityStyle, error) {

	activityStyle := domain.ActivityStyle{}
	var activityStyles []domain.ActivityStyle

	// クエリー実行
	rows, err := a.rep.All(c)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		err := rows.Scan(
			&activityStyle.ID,
			&activityStyle.ActivityID,
			&activityStyle.SponsoStyleID,
			&activityStyle.CreatedAt,
			&activityStyle.UpdatedAt,
		)

		if err != nil {
			return nil, errors.Wrapf(err, "cannot connect SQL")
		}

		activityStyles = append(activityStyles, activityStyle)
	}
	return activityStyles, nil
}

func (a *activityStyleUseCase) GetActivityStyleByID(c context.Context, id string) (domain.ActivityStyle, error) {
	var activityStyle domain.ActivityStyle

	row, err := a.rep.Find(c, id)
	err = row.Scan(
		&activityStyle.ID,
		&activityStyle.ActivityID,
		&activityStyle.SponsoStyleID,
		&activityStyle.CreatedAt,
		&activityStyle.UpdatedAt,
	)

	if err != nil {
		return activityStyle, err
	}

	return activityStyle, nil
}

func (a *activityStyleUseCase) CreateActivityStyle(
	c context.Context,
	activityID string,
	sponsorStyleID string,
	) (domain.ActivityStyle, error) {
	latastActivityStyle := domain.ActivityStyle{}

	err := a.rep.Create(c, activityID, sponsorStyleID)
	row, err := a.rep.FindLatestRecord(c)
	err = row.Scan(
		&latastActivityStyle.ID,
		&latastActivityStyle.ActivityID,
		&latastActivityStyle.SponsoStyleID,
		&latastActivityStyle.CreatedAt,
		&latastActivityStyle.UpdatedAt,
	)

	if err != nil {
		return latastActivityStyle, err
	}
	return latastActivityStyle, nil
}

func (a *activityStyleUseCase) UpdateActivityStyle(
	c context.Context,
	id string,
	activityID string,
	sponsorStyleID string,
	) (domain.ActivityStyle, error) {
	updatedActivityStyle := domain.ActivityStyle{}
	err := a.rep.Update(c, id, activityID, sponsorStyleID)
	row, err := a.rep.Find(c, id)
	err = row.Scan(
		&updatedActivityStyle.ID,
		&updatedActivityStyle.ActivityID,
		&updatedActivityStyle.SponsoStyleID,	
		&updatedActivityStyle.CreatedAt,
		&updatedActivityStyle.UpdatedAt,
	)
	if err != nil {
		return updatedActivityStyle, err
	}
	return updatedActivityStyle, nil
}

func (a *activityStyleUseCase) DestroyActivityStyle(c context.Context, id string) error {
	err := a.rep.Destroy(c, id)
	return err
}
