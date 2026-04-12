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
		var row domain.CampusDonationBuildingTotalRow
		if err := rows.Scan(&row.ID, &row.Name, &row.TotalPrice); err != nil {
			return nil, errors.Wrap(err, "failed to scan campus donation building total")
		}

		buildingTotals = append(buildingTotals, generated.BuildingTotal{
			Id:         row.ID,
			Name:       row.Name,
			TotalPrice: row.TotalPrice,
		})
	}

	if err := rows.Err(); err != nil {
		return nil, errors.Wrap(err, "failed to iterate campus donation building totals")
	}

	return buildingTotals, nil
}
