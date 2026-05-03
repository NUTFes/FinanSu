package usecase

import (
	"reflect"
	"testing"

	"github.com/NUTFes/FinanSu/api/generated"
)

func intPtr(value int) *int {
	return &value
}

func TestAppendBuildingFloorDonation(t *testing.T) {
	t.Parallel()

	buildingFloorIndex := make(map[string]int)
	var buildingFloors []generated.CampusDonationBuildingFloor

	buildingFloors = appendBuildingFloorDonation(
		buildingFloors,
		buildingFloorIndex,
		generated.CampusDonationBuildingFloor{
			BuildingId:   1,
			BuildingName: "機械・建設棟",
			UnitNumber:   1,
			FloorNumber:  "5",
		},
		generated.CampusDonationTeacher{
			RoomName:    "501",
			TeacherId:   1,
			TeacherName: "学内募金API確認教員A",
			TotalPrice:  intPtr(5000),
			IsBlack:     false,
		},
	)
	buildingFloors = appendBuildingFloorDonation(
		buildingFloors,
		buildingFloorIndex,
		generated.CampusDonationBuildingFloor{
			BuildingId:   1,
			BuildingName: "機械・建設棟",
			UnitNumber:   1,
			FloorNumber:  "5",
		},
		generated.CampusDonationTeacher{
			RoomName:    "502",
			TeacherId:   2,
			TeacherName: "学内募金API確認教員B",
			TotalPrice:  nil,
			IsBlack:     true,
		},
	)
	buildingFloors = appendBuildingFloorDonation(
		buildingFloors,
		buildingFloorIndex,
		generated.CampusDonationBuildingFloor{
			BuildingId:   2,
			BuildingName: "機械・建設棟",
			UnitNumber:   2,
			FloorNumber:  "5",
		},
		generated.CampusDonationTeacher{
			RoomName:    "501",
			TeacherId:   3,
			TeacherName: "学内募金API確認教員C",
			TotalPrice:  intPtr(7000),
			IsBlack:     false,
		},
	)

	want := []generated.CampusDonationBuildingFloor{
		{
			BuildingId:   1,
			BuildingName: "機械・建設棟",
			UnitNumber:   1,
			FloorNumber:  "5",
			Donations: []generated.CampusDonationTeacher{
				{
					RoomName:    "501",
					TeacherId:   1,
					TeacherName: "学内募金API確認教員A",
					TotalPrice:  intPtr(5000),
					IsBlack:     false,
				},
				{
					RoomName:    "502",
					TeacherId:   2,
					TeacherName: "学内募金API確認教員B",
					TotalPrice:  nil,
					IsBlack:     true,
				},
			},
		},
		{
			BuildingId:   2,
			BuildingName: "機械・建設棟",
			UnitNumber:   2,
			FloorNumber:  "5",
			Donations: []generated.CampusDonationTeacher{
				{
					RoomName:    "501",
					TeacherId:   3,
					TeacherName: "学内募金API確認教員C",
					TotalPrice:  intPtr(7000),
					IsBlack:     false,
				},
			},
		},
	}

	if !reflect.DeepEqual(buildingFloors, want) {
		t.Fatalf("unexpected result: got %+v, want %+v", buildingFloors, want)
	}
}
