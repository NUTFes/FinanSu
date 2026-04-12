package repository

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
	goqu "github.com/doug-martin/goqu/v9"
)

type campusDonationRepository struct {
	client db.Client
	crud   abstract.Crud
}

type CampusDonationRepository interface {
	AllBuildingTotalsByYear(context.Context, string) (*sql.Rows, error)
}

func NewCampusDonationRepository(c db.Client, ac abstract.Crud) CampusDonationRepository {
	return &campusDonationRepository{c, ac}
}

func (cdr *campusDonationRepository) AllBuildingTotalsByYear(
	c context.Context,
	year string,
) (*sql.Rows, error) {
	donationBuildingsDataset := dialect.
		Select(
			goqu.I("campus_donations.id").As("donation_id"),
			goqu.I("buildings.id").As("building_id"),
			goqu.I("buildings.name").As("building_name"),
			goqu.I("campus_donations.price").As("price"),
		).
		Distinct().
		From(goqu.T("campus_donations")).
		InnerJoin(
			goqu.T("teachers"),
			goqu.On(goqu.I("campus_donations.teacher_id").Eq(goqu.I("teachers.id"))),
		).
		InnerJoin(
			goqu.T("room_teachers"),
			goqu.On(goqu.I("room_teachers.teacher_id").Eq(goqu.I("teachers.id"))),
		).
		InnerJoin(
			goqu.T("rooms"),
			goqu.On(goqu.I("room_teachers.room_id").Eq(goqu.I("rooms.id"))),
		).
		InnerJoin(
			goqu.T("buildings"),
			goqu.On(goqu.I("rooms.building_id").Eq(goqu.I("buildings.id"))),
		).
		InnerJoin(
			goqu.T("years"),
			goqu.On(goqu.I("campus_donations.year_id").Eq(goqu.I("years.id"))),
		).
		Where(goqu.I("years.year").Eq(year))

	query, args, err := dialect.
		From(donationBuildingsDataset.As("donation_buildings")).
		Select(
			goqu.I("donation_buildings.building_id"),
			goqu.I("donation_buildings.building_name"),
			goqu.SUM(goqu.I("donation_buildings.price")).As("total_price"),
		).
		GroupBy(
			goqu.I("donation_buildings.building_id"),
			goqu.I("donation_buildings.building_name"),
		).
		Order(goqu.I("donation_buildings.building_id").Asc()).
		ToSQL()
	if err != nil {
		return nil, err
	}

	stmt, err := cdr.crud.Prepare(c, query)
	if err != nil {
		return nil, err
	}
	defer func() {
		if err := stmt.Close(); err != nil {
			fmt.Println(err)
		}
	}()

	return stmt.QueryContext(c, args...)
}
