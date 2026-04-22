package usecase

import (
	"testing"

	"github.com/NUTFes/FinanSu/api/generated"
)

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
		{Id: 1, Name: "機械・建設棟", TotalPrice: 3000},
		{Id: 2, Name: "電気棟", TotalPrice: 3000},
		{Id: 999, Name: "その他", TotalPrice: 900},
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
