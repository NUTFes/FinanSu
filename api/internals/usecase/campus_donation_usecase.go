package usecase

import (
	"context"
	"fmt"
	"log"
	"time"

	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/generated"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	openapiTypes "github.com/oapi-codegen/runtime/types"
	"github.com/pkg/errors"
)

type campusDonationBuildingGroup struct {
	ID       int
	Name     string
	GroupKey generated.CampusDonationBuildingGroupKey
}

// NOTICE: ここに含まれない棟名はすべて「その他」として扱う。
var campusDonationBuildingGroups = []campusDonationBuildingGroup{
	{ID: 1, Name: "機械・建設棟", GroupKey: generated.MechanicalCivilEngineering},
	{ID: 2, Name: "電気棟", GroupKey: generated.ElectricalEngineering},
	{ID: 3, Name: "生物棟", GroupKey: generated.Biology},
	{ID: 4, Name: "環境・システム棟", GroupKey: generated.EnvironmentalSystem},
	{ID: 5, Name: "物質・材料経営情報棟", GroupKey: generated.MaterialsManagementInformation},
	{ID: 6, Name: "総合研究棟", GroupKey: generated.GeneralResearch},
	{ID: 7, Name: "原子力・システム安全棟", GroupKey: generated.NuclearSystemSafety},
	{ID: 8, Name: "事務局棟", GroupKey: generated.Administration},
	{ID: 9, Name: "極限エネルギ密度工学研究センター", GroupKey: generated.ExtremeEnergyDensityResearchCenter},
	{ID: 10, Name: "工作センター", GroupKey: generated.MachineShop},
	{ID: 11, Name: "大型実験棟", GroupKey: generated.LargeExperiment},
	{ID: 12, Name: "分析計測センター", GroupKey: generated.AnalysisInstrumentationCenter},
	{ID: 999, Name: "その他", GroupKey: generated.Other},
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
	CreateCampusDonation(context.Context, generated.CampusDonationRequest) (generated.CampusDonation, error)
	UpdateCampusDonation(context.Context, int, generated.CampusDonationRequest) (generated.CampusDonation, error)
	GetBuildingFloorDonationsByYear(context.Context, int, *string, *string) ([]generated.CampusDonationBuildingFloor, error)
	GetBuildingTotalsByYear(context.Context, string) ([]generated.BuildingTotal, error)
}

func NewCampusDonationUseCase(rep rep.CampusDonationRepository) CampusDonationUseCase {
	return &campusDonationUseCase{rep: rep}
}

func (cdu *campusDonationUseCase) CreateCampusDonation(
	ctx context.Context,
	request generated.CampusDonationRequest,
) (generated.CampusDonation, error) {
	donation := campusDonationRequestToDomain(request)

	id, err := cdu.rep.Create(ctx, donation)
	if err != nil {
		return generated.CampusDonation{}, err
	}

	createdDonation, err := cdu.rep.FindByID(ctx, id)
	if err != nil {
		return generated.CampusDonation{}, err
	}

	return domainCampusDonationToGenerated(createdDonation)
}

func (cdu *campusDonationUseCase) UpdateCampusDonation(
	ctx context.Context,
	id int,
	request generated.CampusDonationRequest,
) (generated.CampusDonation, error) {
	donation := campusDonationRequestToDomain(request)

	if err := cdu.rep.Update(ctx, id, donation); err != nil {
		return generated.CampusDonation{}, err
	}

	updatedDonation, err := cdu.rep.FindByID(ctx, id)
	if err != nil {
		return generated.CampusDonation{}, err
	}

	return domainCampusDonationToGenerated(updatedDonation)
}

func (cdu *campusDonationUseCase) GetBuildingFloorDonationsByYear(
	ctx context.Context,
	year int,
	groupKey *string,
	floorNumber *string,
) ([]generated.CampusDonationBuildingFloor, error) {
	rows, err := cdu.rep.GetBuildingFloorDonationsByYear(ctx, year, groupKey, floorNumber)
	if err != nil {
		return nil, err
	}
	defer func() {
		if err := rows.Close(); err != nil {
			log.Println(err)
		}
	}()

	buildingFloors := make([]generated.CampusDonationBuildingFloor, 0)
	buildingFloorIndex := make(map[string]int)

	for rows.Next() {
		var buildingFloor generated.CampusDonationBuildingFloor
		var donation generated.CampusDonationTeacher
		if err := rows.Scan(
			&buildingFloor.BuildingId,
			&buildingFloor.BuildingName,
			&buildingFloor.UnitNumber,
			&buildingFloor.FloorNumber,
			&donation.RoomName,
			&donation.TeacherId,
			&donation.TeacherName,
			&donation.TotalPrice,
			&donation.IsBlack,
		); err != nil {
			return nil, errors.Wrap(err, "failed to scan campus donation building floor row")
		}

		buildingFloors = appendBuildingFloorDonation(buildingFloors, buildingFloorIndex, buildingFloor, donation)
	}

	if err := rows.Err(); err != nil {
		return nil, errors.Wrap(err, "failed to iterate campus donation building floors")
	}

	return buildingFloors, nil
}

func appendBuildingFloorDonation(
	buildingFloors []generated.CampusDonationBuildingFloor,
	buildingFloorIndex map[string]int,
	buildingFloor generated.CampusDonationBuildingFloor,
	donation generated.CampusDonationTeacher,
) []generated.CampusDonationBuildingFloor {
	indexKey := fmt.Sprintf("%d:%s", buildingFloor.BuildingId, buildingFloor.FloorNumber)
	index, ok := buildingFloorIndex[indexKey]
	if !ok {
		buildingFloor.Donations = []generated.CampusDonationTeacher{}
		buildingFloors = append(buildingFloors, buildingFloor)
		index = len(buildingFloors) - 1
		buildingFloorIndex[indexKey] = index
	}

	buildingFloors[index].Donations = append(buildingFloors[index].Donations, donation)

	return buildingFloors
}

func campusDonationRequestToDomain(request generated.CampusDonationRequest) domain.CampusDonation {
	return domain.CampusDonation{
		UserID:     request.UserId,
		TeacherID:  request.TeacherId,
		YearID:     request.YearId,
		Price:      request.Price,
		ReceivedAt: request.ReceivedAt.String(),
	}
}

func domainCampusDonationToGenerated(donation domain.CampusDonation) (generated.CampusDonation, error) {
	receivedAt, err := time.Parse(openapiTypes.DateFormat, donation.ReceivedAt)
	if err != nil {
		return generated.CampusDonation{}, err
	}

	return generated.CampusDonation{
		Id:         donation.ID,
		UserId:     donation.UserID,
		TeacherId:  donation.TeacherID,
		YearId:     donation.YearID,
		Price:      donation.Price,
		ReceivedAt: openapiTypes.Date{Time: receivedAt},
	}, nil
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
		groupedBuildingTotals = append(groupedBuildingTotals, generated.BuildingTotal{
			Id:         group.ID,
			Name:       group.Name,
			GroupKey:   group.GroupKey,
			TotalPrice: totalPriceByGroupID[group.ID],
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
