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
	GetCampusDonationByFloors(context.Context, string, string) ([]CampusDonationByFloorAndBuilding, error)
}

func NewCampusDonationUseCase(rep rep.CampusDonationRepository) CampusDonationUseCase {
	return &campusDonationUseCase{rep}
}

func (cdu *campusDonationUseCase) GetCampusDonationByFloors(c context.Context, buildingId string, floorId string) ([]CampusDonationByFloorAndBuilding, error) {

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

	var campusDonationRecords []domain.CampusDonationRecord
	for rows.Next() {
		var campusDonationRecord domain.CampusDonationRecord
		if err := rows.Scan(
			&campusDonationRecord.BuildingId,
			&campusDonationRecord.BuildingName,
			&campusDonationRecord.FloorId,
			&campusDonationRecord.FloorNumber,
			&campusDonationRecord.TeacherId,
			&campusDonationRecord.TeacherName,
			&campusDonationRecord.RoomName,
			&campusDonationRecord.Price,
			&campusDonationRecord.IsBlack,
		); err != nil {
			return nil, errors.Wrap(err, "scanning flat campus donation record")
		}
		campusDonationRecords = append(campusDonationRecords, campusDonationRecord)
	}

	// --- （2）ネスト構造にマップ→スライス化 ---
	groupMap := make(map[int]*generated.CampusDonationByFloorAndBuilding)
	for _, r := range campusDonationRecords {
		buildingGroup, ok := groupMap[r.BuildingId]
		if !ok {
			buildingGroup = &generated.CampusDonationByFloorAndBuilding{
				BuildingId:   r.BuildingId,
				BuildingName: r.BuildingName,
				Floors:       []generated.FloorGroup{},
			}
			groupMap[r.BuildingId] = buildingGroup
		}
		// Floor レベル取得 or 初期化
    var floorGroup *generated.FloorGroup
		for i := range buildingGroup.Floors {
        if buildingGroup.Floors[i].FloorId != nil && r.FloorId != nil &&
            *buildingGroup.Floors[i].FloorId == *r.FloorId {
            floorGroup = &buildingGroup.Floors[i]
            break
			}
		}
		if floorGroup == nil {
			newFg := generated.FloorGroup{
				FloorId:     r.FloorId,
				FloorNumber: r.FloorNumber,
				Donations:   []generated.CampusDonation{},
			}
			buildingGroup.Floors = append(buildingGroup.Floors, newFg)
			floorGroup = &buildingGroup.Floors[len(buildingGroup.Floors)-1]
		}
		// Donation 追加
		floorGroup.Donations = append(floorGroup.Donations, generated.CampusDonation{
			TeacherId:   r.TeacherId,
			TeacherName: r.TeacherName,
			RoomName:    r.RoomName,
			Price:       r.Price,
			IsBlack:     r.IsBlack,
		})
	}
	// map→slice
	var result []generated.CampusDonationByFloorAndBuilding
	for _, gb := range groupMap {
		result = append(result, *gb)
	}
	return result, nil
}

type CampusDonationByFloorAndBuilding = generated.CampusDonationByFloorAndBuilding
type CampusDonationRecord = domain.CampusDonationRecord
