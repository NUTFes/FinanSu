package usecase

import (
	"context"

	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/pkg/errors"
)

type activityInformationUseCase struct {
	rep rep.ActivityInformationRepository
}

type ActivityInformationUseCase interface {
	GetActivityInformation(context.Context) ([]domain.ActivityInformation, error)
	GetActivityInformationByID(context.Context, string) (domain.ActivityInformation, error)
	CreateActivityInformation(context.Context, string, string, string, string, string, string) (domain.ActivityInformation, error)
	UpdateActivityInformation(context.Context, string, string, string, string, string, string, string) (domain.ActivityInformation, error)
	DestroyActivityInformation(context.Context, string) error
}

func NewActivityInformationUseCase(rep rep.ActivityInformationRepository) ActivityInformationUseCase {
	return &activityInformationUseCase{rep}
}

func (a *activityInformationUseCase) GetActivityInformation(c context.Context) ([]domain.ActivityInformation, error) {

	activityInformation := domain.ActivityInformation{}
	var activityInformations []domain.ActivityInformation

	// クエリー実行
	rows, err := a.rep.All(c)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

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
			return nil, errors.Wrapf(err, "cannot connect SQL")
		}

		activityInformations = append(activityInformations, activityInformation)
	}
	return activityInformations, nil
}

func (a *activityInformationUseCase) GetActivityInformationByID(c context.Context, id string) (domain.ActivityInformation, error) {
	var activityInformation domain.ActivityInformation

	row, err := a.rep.Find(c, id)
	err = row.Scan(
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
		return activityInformation, err
	}

	return activityInformation, nil
}

func (a *activityInformationUseCase) CreateActivityInformation(
	c context.Context,
	activityId string,
	bucketName string,
	fileName string,
	fileType string,
	designProgress string,
	fileInformation string) (domain.ActivityInformation, error) {
	latastActivityInformation := domain.ActivityInformation{}

	err := a.rep.Create(c, activityId, bucketName, fileName, fileType, designProgress, fileInformation)
	row, err := a.rep.FindLatestRecord(c)
	err = row.Scan(
		&latastActivityInformation.ID,
		&latastActivityInformation.ActivityId,
		&latastActivityInformation.BucketName,
		&latastActivityInformation.FileName,
		&latastActivityInformation.FileType,
		&latastActivityInformation.DesignProgress,
		&latastActivityInformation.FileInformation,
		&latastActivityInformation.CreatedAt,
		&latastActivityInformation.UpdatedAt,
	)

	if err != nil {
		return latastActivityInformation, err
	}
	return latastActivityInformation, nil
}

func (a *activityInformationUseCase) UpdateActivityInformation(
	c context.Context,
	id string,
	activityId string,
	bucketName string,
	fileName string,
	fileType string,
	designProgress string,
	fileInformation string) (domain.ActivityInformation, error) {
	updatedActivityInformation := domain.ActivityInformation{}
	err := a.rep.Update(c, id, activityId, bucketName, fileName, fileType, designProgress, fileInformation)
	row, err := a.rep.Find(c, id)
	err = row.Scan(
		&updatedActivityInformation.ID,
		&updatedActivityInformation.ActivityId,
		&updatedActivityInformation.BucketName,
		&updatedActivityInformation.FileName,
		&updatedActivityInformation.FileType,
		&updatedActivityInformation.DesignProgress,
		&updatedActivityInformation.FileInformation,
		&updatedActivityInformation.CreatedAt,
		&updatedActivityInformation.UpdatedAt,

	)
	if err != nil {
		return updatedActivityInformation, err
	}
	return updatedActivityInformation, nil
}

func (a *activityInformationUseCase) DestroyActivityInformation(c context.Context, id string) error {
	err := a.rep.Destroy(c, id)
	return err
}

