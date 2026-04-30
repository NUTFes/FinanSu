package repository

import (
	"context"
	"database/sql"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	goqu "github.com/doug-martin/goqu/v9"
)

type campusDonationRepository struct {
	client db.Client
}

type CampusDonationRepository interface {
	GetBuildingFloorDonationsByYear(context.Context, int, string, *string) (*sql.Rows, error)
}

func NewCampusDonationRepository(c db.Client) CampusDonationRepository {
	return &campusDonationRepository{client: c}
}

func (cdr *campusDonationRepository) GetBuildingFloorDonationsByYear(
	ctx context.Context,
	year int,
	floorNumber string,
	groupKey *string,
) (*sql.Rows, error) {
	donationTotalsByTeacher := dialect.
		Select(
			goqu.I("campus_donations.teacher_id").As("teacher_id"),
			goqu.SUM(goqu.I("campus_donations.price")).As("total_price"),
		).
		From(goqu.T("campus_donations")).
		InnerJoin(
			goqu.T("years"),
			goqu.On(goqu.I("campus_donations.year_id").Eq(goqu.I("years.id"))),
		).
		Where(goqu.I("years.year").Eq(year)).
		GroupBy(goqu.I("campus_donations.teacher_id"))

	queryDataset := dialect.
		From(goqu.T("buildings")).
		InnerJoin(
			goqu.T("rooms"),
			goqu.On(goqu.I("rooms.building_id").Eq(goqu.I("buildings.id"))),
		).
		InnerJoin(
			goqu.T("room_teachers"),
			goqu.On(goqu.I("room_teachers.room_id").Eq(goqu.I("rooms.id"))),
		).
		InnerJoin(
			goqu.T("teachers"),
			goqu.On(goqu.I("teachers.id").Eq(goqu.I("room_teachers.teacher_id"))),
		).
		LeftJoin(
			donationTotalsByTeacher.As("donation_totals"),
			goqu.On(goqu.I("donation_totals.teacher_id").Eq(goqu.I("teachers.id"))),
		).
		Select(
			goqu.I("buildings.id").As("building_id"),
			goqu.I("buildings.name").As("building_name"),
			goqu.I("buildings.unit_number").As("unit_number"),
			goqu.I("rooms.floor_number").As("floor_number"),
			goqu.I("rooms.room_name").As("room_name"),
			goqu.I("teachers.id").As("teacher_id"),
			goqu.I("teachers.name").As("teacher_name"),
			goqu.COALESCE(goqu.I("donation_totals.total_price"), 0).As("total_price"),
			goqu.COALESCE(goqu.I("teachers.is_black"), false).As("is_black"),
		).
		Where(goqu.I("rooms.floor_number").Eq(floorNumber)).
		Order(
			goqu.I("buildings.unit_number").Asc(),
			goqu.I("buildings.id").Asc(),
			goqu.I("rooms.room_name").Asc(),
			goqu.I("teachers.name").Asc(),
		)

	if groupKey != nil && *groupKey != "" {
		queryDataset = queryDataset.Where(goqu.I("buildings.group_key").Eq(*groupKey))
	}

	query, args, err := queryDataset.ToSQL()
	if err != nil {
		return nil, err
	}

	return cdr.client.DB().QueryContext(ctx, query, args...)
}
