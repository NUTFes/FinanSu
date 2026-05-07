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

func TestGroupBuildingTotalsByDisplayGroup(t *testing.T) {
	t.Parallel()

	buildingTotals := []generated.BuildingTotal{
		{Id: 1, Name: "機械・建設棟", TotalPrice: 1000},
		{Id: 2, Name: "機械・建設棟", TotalPrice: 2000},
		{Id: 4, Name: "電気棟", TotalPrice: 3000},
		{Id: 100, Name: "GX棟", TotalPrice: 400},
		{Id: 101, Name: "博士棟", TotalPrice: 500},
	}

	got := groupBuildingTotalsByDisplayGroup(buildingTotals)
	want := []generated.BuildingTotal{
		{Id: 1, Name: "機械・建設棟", GroupKey: generated.MechanicalCivilEngineering, TotalPrice: 3000},
		{Id: 2, Name: "電気棟", GroupKey: generated.ElectricalEngineering, TotalPrice: 3000},
		{Id: 3, Name: "生物棟", GroupKey: generated.Biology, TotalPrice: 0},
		{Id: 4, Name: "環境・システム棟", GroupKey: generated.EnvironmentalSystem, TotalPrice: 0},
		{Id: 5, Name: "物質・材料経営情報棟", GroupKey: generated.MaterialsManagementInformation, TotalPrice: 0},
		{Id: 6, Name: "総合研究棟", GroupKey: generated.GeneralResearch, TotalPrice: 0},
		{Id: 7, Name: "原子力・システム安全棟", GroupKey: generated.NuclearSystemSafety, TotalPrice: 0},
		{Id: 8, Name: "事務局棟", GroupKey: generated.Administration, TotalPrice: 0},
		{Id: 9, Name: "極限エネルギ密度工学研究センター", GroupKey: generated.ExtremeEnergyDensityResearchCenter, TotalPrice: 0},
		{Id: 10, Name: "工作センター", GroupKey: generated.MachineShop, TotalPrice: 0},
		{Id: 11, Name: "大型実験棟", GroupKey: generated.LargeExperiment, TotalPrice: 0},
		{Id: 12, Name: "分析計測センター", GroupKey: generated.AnalysisInstrumentationCenter, TotalPrice: 0},
		{Id: 999, Name: "その他", GroupKey: generated.Other, TotalPrice: 900},
	}

	if len(got) != len(want) {
		t.Fatalf("unexpected result length: got %d, want %d", len(got), len(want))
	}

	for i := range want {
		if got[i] != want[i] {
			t.Fatalf("unexpected grouped result at index %d: got %+v, want %+v", i, got[i], want[i])
		}
	}
}
