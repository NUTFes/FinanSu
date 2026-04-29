package usecase

import (
	"context"
	"log"

	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/generated"
	"github.com/pkg/errors"
)

type campusDonationUseCase struct {
	rep rep.CampusDonationRepository
}

type CampusDonationUseCase interface {
	GetBuildingFloorDonationsByYear(context.Context, int, string, *string) ([]generated.CampusDonationBuildingFloor, error)
}

func NewCampusDonationUseCase(rep rep.CampusDonationRepository) CampusDonationUseCase {
	return &campusDonationUseCase{rep: rep}
}

func (cdu *campusDonationUseCase) GetBuildingFloorDonationsByYear(
	ctx context.Context,
	year int,
	floorNumber string,
	groupKey *string,
) ([]generated.CampusDonationBuildingFloor, error) {
	rows, err := cdu.rep.GetBuildingFloorDonationsByYear(ctx, year, floorNumber, groupKey)
	if err != nil {
		return nil, err
	}
	defer func() {
		if err := rows.Close(); err != nil {
			log.Println(err)
		}
	}()

	buildingFloors := make([]generated.CampusDonationBuildingFloor, 0)
	buildingIndexByID := make(map[int]int)

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

		buildingFloors = appendBuildingFloorDonation(buildingFloors, buildingIndexByID, buildingFloor, donation)
	}

	if err := rows.Err(); err != nil {
		return nil, errors.Wrap(err, "failed to iterate campus donation building floors")
	}

	return buildingFloors, nil
}

func appendBuildingFloorDonation(
	buildingFloors []generated.CampusDonationBuildingFloor,
	buildingIndexByID map[int]int,
	buildingFloor generated.CampusDonationBuildingFloor,
	donation generated.CampusDonationTeacher,
) []generated.CampusDonationBuildingFloor {
	index, ok := buildingIndexByID[buildingFloor.BuildingId]
	if !ok {
		buildingFloor.Donations = []generated.CampusDonationTeacher{}
		buildingFloors = append(buildingFloors, buildingFloor)
		index = len(buildingFloors) - 1
		buildingIndexByID[buildingFloor.BuildingId] = index
	}

	buildingFloors[index].Donations = append(buildingFloors[index].Donations, donation)

	return buildingFloors
}
