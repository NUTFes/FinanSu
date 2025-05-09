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
	GetCampusDonationByFloors(context.Context, string, string) ([]CampusDonationByFloor, error)
	GetCampusDonationBuildingByPeriod(context.Context, string) ([]BuildingTotal, error)
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

func (f *campusDonationUseCase) GetCampusDonationBuildingByPeriod(c context.Context, year string) ([]BuildingTotal, error) {
	rows, err := f.rep.AllBuildingsByPeriod(c, year)
	if err != nil {
		return nil, err
	}
	defer func() {
		if err := rows.Close(); err != nil {
			log.Println(err)
		}
	}()

	aggregated := make(map[int]*BuildingTotal)
	for rows.Next() {
		var buildingTotal domain.FundInformationBuilding
		if err := rows.Scan(&buildingTotal.Id, &buildingTotal.Name, &buildingTotal.Price); err != nil {
			return nil, err
		}
		if b, exists := aggregated[buildingTotal.Id]; exists {
			if b.TotalPrice == nil {
				b.TotalPrice = new(int)
			}
			*b.TotalPrice += buildingTotal.Price
		} else {
			id := buildingTotal.Id
			name := buildingTotal.Name
			price := buildingTotal.Price
			aggregated[buildingTotal.Id] = &BuildingTotal{
				Id:         &id,
				Name:       &name,
				TotalPrice: &price,
			}
		}
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	var result []BuildingTotal
	for _, b := range aggregated {
		result = append(result, *b)
	}
	return result, nil
}

type BuildingTotal generated.BuildingTotal
