package usecase

import (
	"context"
	"log"

	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/generated"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/pkg/errors"
	"github.com/samber/lo"
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

	return convertCampusDonationRecordsToNestedStructure(campusDonationRecords), nil
}

// convertCampusDonationRecordsToNestedStructure はcampusDonationRecordをネスト構造に変換する。
func convertCampusDonationRecordsToNestedStructure(records []domain.CampusDonationRecord) []CampusDonationByFloorAndBuilding {
	// 建物ごとにグループ化するためのマップを作成
	groupMap := make(map[int]*CampusDonationByFloorAndBuilding)

	for _, record := range records {
		buildingGroup, ok := groupMap[record.BuildingId]
		if !ok {
			buildingGroup = &CampusDonationByFloorAndBuilding{
				BuildingId:   record.BuildingId,
				BuildingName: record.BuildingName,
				Floors:       []FloorGroup{},
			}
			groupMap[record.BuildingId] = buildingGroup
		}

		// floorGroupの検索
		var floorGroup *FloorGroup
		for i := range buildingGroup.Floors {
			if buildingGroup.Floors[i].FloorId != nil && record.FloorId != nil &&
				*buildingGroup.Floors[i].FloorId == *record.FloorId {
				floorGroup = &buildingGroup.Floors[i]
				break
			}
		}
		// ない場合、floorGroupを作成
		if floorGroup == nil {
			newFloorGroup := FloorGroup{
				FloorId:     record.FloorId,
				FloorNumber: record.FloorNumber,
				Donations:   []CampusDonation{},
			}
			buildingGroup.Floors = append(buildingGroup.Floors, newFloorGroup)
			floorGroup = &buildingGroup.Floors[len(buildingGroup.Floors)-1]
		}

		// campusDonationの追加
		floorGroup.Donations = append(floorGroup.Donations, CampusDonation{
			TeacherId:   record.TeacherId,
			TeacherName: record.TeacherName,
			RoomName:    record.RoomName,
			Price:       record.Price,
			IsBlack:     record.IsBlack,
		})
	}

	// lo.MapToSliceを使用してマップをスライスに変換
	return lo.MapToSlice(groupMap, func(_ int, v *CampusDonationByFloorAndBuilding) CampusDonationByFloorAndBuilding {
		return *v
	})
}

type CampusDonationByFloorAndBuilding = generated.CampusDonationByFloorAndBuilding
type CampusDonationRecord = domain.CampusDonationRecord
type FloorGroup = generated.FloorGroup
type CampusDonation = generated.CampusDonation
