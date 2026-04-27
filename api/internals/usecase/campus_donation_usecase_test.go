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
		{Id: 3, Name: "生物棟", TotalPrice: 0},
		{Id: 4, Name: "環境・システム棟", TotalPrice: 0},
		{Id: 5, Name: "物質・材料経営情報棟", TotalPrice: 0},
		{Id: 6, Name: "総合研究棟", TotalPrice: 0},
		{Id: 7, Name: "原子力・システム安全棟", TotalPrice: 0},
		{Id: 8, Name: "事務局棟", TotalPrice: 0},
		{Id: 9, Name: "極限エネルギ密度工学研究センター", TotalPrice: 0},
		{Id: 10, Name: "工作センター", TotalPrice: 0},
		{Id: 11, Name: "大型実験棟", TotalPrice: 0},
		{Id: 12, Name: "分析計測センター", TotalPrice: 0},
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
