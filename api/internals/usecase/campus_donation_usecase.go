package usecase

import (
	"context"
	"log"

	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/generated"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/pkg/errors"
)

type campusDonationUseCase struct {
	rep rep.CampusDonationRepository
}

type CampusDonationUseCase interface {
	GetBuildingFloorDonationsByYear(context.Context, int, int, string) ([]generated.CampusDonationBuildingFloor, error)
}

func NewCampusDonationUseCase(rep rep.CampusDonationRepository) CampusDonationUseCase {
	return &campusDonationUseCase{rep: rep}
}

func (cdu *campusDonationUseCase) GetBuildingFloorDonationsByYear(
	ctx context.Context,
	year int,
	buildingID int,
	floorNumber string,
) ([]generated.CampusDonationBuildingFloor, error) {
	rows, err := cdu.rep.GetBuildingFloorDonationsByYear(ctx, year, buildingID, floorNumber)
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
		var row domain.CampusDonationBuildingFloorRow
		if err := rows.Scan(
			&row.BuildingID,
			&row.BuildingName,
			&row.UnitNumber,
			&row.FloorNumber,
			&row.RoomName,
			&row.TeacherID,
			&row.TeacherName,
			&row.TotalPrice,
			&row.IsBlack,
		); err != nil {
			return nil, errors.Wrap(err, "failed to scan campus donation building floor row")
		}

		index, ok := buildingIndexByID[row.BuildingID]
		if !ok {
			buildingFloors = append(buildingFloors, generated.CampusDonationBuildingFloor{
				BuildingId:   row.BuildingID,
				BuildingName: row.BuildingName,
				UnitNumber:   row.UnitNumber,
				FloorNumber:  row.FloorNumber,
				Donations:    []generated.CampusDonationTeacher{},
			})
			index = len(buildingFloors) - 1
			buildingIndexByID[row.BuildingID] = index
		}

		buildingFloors[index].Donations = append(
			buildingFloors[index].Donations,
			generated.CampusDonationTeacher{
				RoomName:    row.RoomName,
				TeacherId:   row.TeacherID,
				TeacherName: row.TeacherName,
				TotalPrice:  row.TotalPrice,
				IsBlack:     row.IsBlack,
			},
		)
	}

	if err := rows.Err(); err != nil {
		return nil, errors.Wrap(err, "failed to iterate campus donation building floors")
	}

	return buildingFloors, nil
}
