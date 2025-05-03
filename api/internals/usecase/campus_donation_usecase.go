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
	GetCampusDonationByFloors(context.Context, string, string) ([]CampusDonationByFloor, error)
}

func NewCampusDonationUseCase(rep rep.CampusDonationRepository) CampusDonationUseCase {
	return &campusDonationUseCase{rep}
}

func (cdu *campusDonationUseCase) GetCampusDonationByFloors(c context.Context, buildingId string, floorId string) ([]CampusDonationByFloor, error) {
	var campusDonation CampusDonationByFloor
	var campusDonations []CampusDonationByFloor

	//クエリ実行
	rows, err := cdu.rep.AllCampusDonationByFloor(c, buildingId, floorId)
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
			&campusDonation.BuildingName,
			&campusDonation.UnitNumber,
			&campusDonation.FloorNumber,
			&campusDonation.RoomName,
			&campusDonation.TeacherId,
			&campusDonation.TeacherName,
			&campusDonation.IsBlack,
			&campusDonation.Price,
		)

		if err != nil {
			return nil, errors.Wrapf(err, "can not connect SQL")
		}
		campusDonations = append(campusDonations, campusDonation)
	}
	return campusDonations, nil
}

type CampusDonationByFloor = generated.CampusDonationByFloor
