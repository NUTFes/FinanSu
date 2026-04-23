package usecase

import (
	"context"
	"log"

	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/generated"
	"github.com/pkg/errors"
)

type campusDonationBuildingGroup struct {
	ID   int
	Name string
}

// NOTICE: ここに含まれない棟名はすべて「その他」として扱う。
var campusDonationBuildingGroups = []campusDonationBuildingGroup{
	{ID: 1, Name: "機械・建設棟"},
	{ID: 2, Name: "電気棟"},
	{ID: 3, Name: "生物棟"},
	{ID: 4, Name: "環境・システム棟"},
	{ID: 5, Name: "物質・材料経営情報棟"},
	{ID: 6, Name: "総合研究棟"},
	{ID: 7, Name: "原子力・システム安全棟"},
	{ID: 8, Name: "事務局棟"},
	{ID: 9, Name: "極限エネルギ密度工学研究センター"},
	{ID: 10, Name: "工作センター"},
	{ID: 11, Name: "大型実験棟"},
	{ID: 12, Name: "分析計測センター"},
	{ID: 999, Name: "その他"},
}

var campusDonationBuildingGroupByName = map[string]campusDonationBuildingGroup{
	"機械・建設棟":      campusDonationBuildingGroups[0],
	"電気棟":         campusDonationBuildingGroups[1],
	"生物棟":         campusDonationBuildingGroups[2],
	"環境・システム棟":    campusDonationBuildingGroups[3],
	"物質・材料経営情報棟":  campusDonationBuildingGroups[4],
	"総合研究棟":       campusDonationBuildingGroups[5],
	"原子力・システム安全棟": campusDonationBuildingGroups[6],
	"事務局棟":        campusDonationBuildingGroups[7],
	"極限エネルギ密度工学研究センター": campusDonationBuildingGroups[8],
	"工作センター":   campusDonationBuildingGroups[9],
	"大型実験棟":    campusDonationBuildingGroups[10],
	"分析計測センター": campusDonationBuildingGroups[11],
}

type campusDonationUseCase struct {
	rep rep.CampusDonationRepository
}

type CampusDonationUseCase interface {
	GetBuildingTotalsByYear(context.Context, string) ([]generated.BuildingTotal, error)
}

func NewCampusDonationUseCase(rep rep.CampusDonationRepository) CampusDonationUseCase {
	return &campusDonationUseCase{rep}
}

func (cdu *campusDonationUseCase) GetBuildingTotalsByYear(
	c context.Context,
	year string,
) ([]generated.BuildingTotal, error) {
	rows, err := cdu.rep.AllBuildingTotalsByYear(c, year)
	if err != nil {
		return nil, err
	}
	defer func() {
		if err := rows.Close(); err != nil {
			log.Println(err)
		}
	}()

	buildingTotals := make([]generated.BuildingTotal, 0)
	for rows.Next() {
		var buildingTotal generated.BuildingTotal
		if err := rows.Scan(&buildingTotal.Id, &buildingTotal.Name, &buildingTotal.TotalPrice); err != nil {
			return nil, errors.Wrap(err, "failed to scan campus donation building total")
		}

		buildingTotals = append(buildingTotals, buildingTotal)
	}

	if err := rows.Err(); err != nil {
		return nil, errors.Wrap(err, "failed to iterate campus donation building totals")
	}

	return groupBuildingTotalsByDisplayGroup(buildingTotals), nil
}

func groupBuildingTotalsByDisplayGroup(buildingTotals []generated.BuildingTotal) []generated.BuildingTotal {
	totalPriceByGroupID := make(map[int]int, len(campusDonationBuildingGroups))

	for _, buildingTotal := range buildingTotals {
		group := getCampusDonationBuildingGroup(buildingTotal.Name)
		totalPriceByGroupID[group.ID] += buildingTotal.TotalPrice
	}

	groupedBuildingTotals := make([]generated.BuildingTotal, 0, len(campusDonationBuildingGroups))
	for _, group := range campusDonationBuildingGroups {
		totalPrice, ok := totalPriceByGroupID[group.ID]
		if !ok {
			continue
		}

		groupedBuildingTotals = append(groupedBuildingTotals, generated.BuildingTotal{
			Id:         group.ID,
			Name:       group.Name,
			TotalPrice: totalPrice,
		})
	}

	return groupedBuildingTotals
}

func getCampusDonationBuildingGroup(buildingName string) campusDonationBuildingGroup {
	if group, ok := campusDonationBuildingGroupByName[buildingName]; ok {
		return group
	}

	return campusDonationBuildingGroups[len(campusDonationBuildingGroups)-1]
}
