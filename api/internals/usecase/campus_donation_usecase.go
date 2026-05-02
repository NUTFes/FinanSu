package usecase

import (
	"context"
	"fmt"
	"log"
	"time"

	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/generated"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	openapiTypes "github.com/oapi-codegen/runtime/types"
	"github.com/pkg/errors"
)

type campusDonationUseCase struct {
	rep rep.CampusDonationRepository
}

type CampusDonationUseCase interface {
	CreateCampusDonation(context.Context, generated.CampusDonationRequest) (generated.CampusDonation, error)
	UpdateCampusDonation(context.Context, int, generated.CampusDonationRequest) (generated.CampusDonation, error)
	GetBuildingFloorDonationsByYear(context.Context, int, *string, *string) ([]generated.CampusDonationBuildingFloor, error)
}

func NewCampusDonationUseCase(rep rep.CampusDonationRepository) CampusDonationUseCase {
	return &campusDonationUseCase{rep: rep}
}

func (cdu *campusDonationUseCase) CreateCampusDonation(
	ctx context.Context,
	request generated.CampusDonationRequest,
) (generated.CampusDonation, error) {
	donation := campusDonationRequestToDomain(request)

	id, err := cdu.rep.Create(ctx, donation)
	if err != nil {
		return generated.CampusDonation{}, err
	}

	createdDonation, err := cdu.rep.FindByID(ctx, id)
	if err != nil {
		return generated.CampusDonation{}, err
	}

	return domainCampusDonationToGenerated(createdDonation)
}

func (cdu *campusDonationUseCase) UpdateCampusDonation(
	ctx context.Context,
	id int,
	request generated.CampusDonationRequest,
) (generated.CampusDonation, error) {
	donation := campusDonationRequestToDomain(request)

	if err := cdu.rep.Update(ctx, id, donation); err != nil {
		return generated.CampusDonation{}, err
	}

	updatedDonation, err := cdu.rep.FindByID(ctx, id)
	if err != nil {
		return generated.CampusDonation{}, err
	}

	return domainCampusDonationToGenerated(updatedDonation)
}

func (cdu *campusDonationUseCase) GetBuildingFloorDonationsByYear(
	ctx context.Context,
	year int,
	groupKey *string,
	floorNumber *string,
) ([]generated.CampusDonationBuildingFloor, error) {
	rows, err := cdu.rep.GetBuildingFloorDonationsByYear(ctx, year, groupKey, floorNumber)
	if err != nil {
		return nil, err
	}
	defer func() {
		if err := rows.Close(); err != nil {
			log.Println(err)
		}
	}()

	buildingFloors := make([]generated.CampusDonationBuildingFloor, 0)
	buildingFloorIndex := make(map[string]int)

	for rows.Next() {
		var buildingFloor generated.CampusDonationBuildingFloor
		var donation generated.CampusDonationTeacher
		if err := rows.Scan(
			&buildingFloor.BuildingId,
			&buildingFloor.BuildingName,
			&buildingFloor.UnitNumber,
			&buildingFloor.FloorNumber,
			&donation.RoomName,
			&donation.TeacherId,
			&donation.TeacherName,
			&donation.TotalPrice,
			&donation.IsBlack,
		); err != nil {
			return nil, errors.Wrap(err, "failed to scan campus donation building floor row")
		}

		buildingFloors = appendBuildingFloorDonation(buildingFloors, buildingFloorIndex, buildingFloor, donation)
	}

	if err := rows.Err(); err != nil {
		return nil, errors.Wrap(err, "failed to iterate campus donation building floors")
	}

	return buildingFloors, nil
}

func appendBuildingFloorDonation(
	buildingFloors []generated.CampusDonationBuildingFloor,
	buildingFloorIndex map[string]int,
	buildingFloor generated.CampusDonationBuildingFloor,
	donation generated.CampusDonationTeacher,
) []generated.CampusDonationBuildingFloor {
	indexKey := fmt.Sprintf("%d:%s", buildingFloor.BuildingId, buildingFloor.FloorNumber)
	index, ok := buildingFloorIndex[indexKey]
	if !ok {
		buildingFloor.Donations = []generated.CampusDonationTeacher{}
		buildingFloors = append(buildingFloors, buildingFloor)
		index = len(buildingFloors) - 1
		buildingFloorIndex[indexKey] = index
	}

	buildingFloors[index].Donations = append(buildingFloors[index].Donations, donation)

	return buildingFloors
}

func campusDonationRequestToDomain(request generated.CampusDonationRequest) domain.CampusDonation {
	return domain.CampusDonation{
		UserID:     request.UserId,
		TeacherID:  request.TeacherId,
		YearID:     request.YearId,
		Price:      request.Price,
		ReceivedAt: request.ReceivedAt.String(),
	}
}

func domainCampusDonationToGenerated(donation domain.CampusDonation) (generated.CampusDonation, error) {
	receivedAt, err := time.Parse(openapiTypes.DateFormat, donation.ReceivedAt)
	if err != nil {
		return generated.CampusDonation{}, err
	}

	return generated.CampusDonation{
		Id:         donation.ID,
		UserId:     donation.UserID,
		TeacherId:  donation.TeacherID,
		YearId:     donation.YearID,
		Price:      donation.Price,
		ReceivedAt: openapiTypes.Date{Time: receivedAt},
	}, nil
}
