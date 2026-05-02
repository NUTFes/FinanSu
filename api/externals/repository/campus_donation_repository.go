package repository

import (
	"context"
	"database/sql"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	goqu "github.com/doug-martin/goqu/v9"
)

type campusDonationRepository struct {
	client db.Client
}

type CampusDonationRepository interface {
	Create(context.Context, domain.CampusDonation) (int, error)
	Update(context.Context, int, domain.CampusDonation) error
	FindByID(context.Context, int) (domain.CampusDonation, error)
	GetBuildingFloorDonationsByYear(context.Context, int, *string, *string) (*sql.Rows, error)
}

func NewCampusDonationRepository(c db.Client) CampusDonationRepository {
	return &campusDonationRepository{client: c}
}

func (cdr *campusDonationRepository) Create(ctx context.Context, donation domain.CampusDonation) (int, error) {
	ds := dialect.
		Insert(goqu.T("campus_donations")).
		Rows(goqu.Record{
			"user_id":     donation.UserID,
			"teacher_id":  donation.TeacherID,
			"year_id":     donation.YearID,
			"price":       donation.Price,
			"received_at": donation.ReceivedAt,
		})

	query, args, err := ds.ToSQL()
	if err != nil {
		return 0, err
	}

	result, err := cdr.client.DB().ExecContext(ctx, query, args...)
	if err != nil {
		return 0, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return int(id), nil
}

func (cdr *campusDonationRepository) Update(ctx context.Context, id int, donation domain.CampusDonation) error {
	ds := dialect.
		Update(goqu.T("campus_donations")).
		Set(goqu.Record{
			"user_id":     donation.UserID,
			"teacher_id":  donation.TeacherID,
			"year_id":     donation.YearID,
			"price":       donation.Price,
			"received_at": donation.ReceivedAt,
		}).
		Where(goqu.I("id").Eq(id))

	query, args, err := ds.ToSQL()
	if err != nil {
		return err
	}

	_, err = cdr.client.DB().ExecContext(ctx, query, args...)
	return err
}

func (cdr *campusDonationRepository) FindByID(ctx context.Context, id int) (domain.CampusDonation, error) {
	ds := selectCampusDonationQuery().Where(goqu.I("campus_donations.id").Eq(id)).Limit(1)

	query, args, err := ds.ToSQL()
	if err != nil {
		return domain.CampusDonation{}, err
	}

	var donation domain.CampusDonation
	err = cdr.client.DB().QueryRowContext(ctx, query, args...).Scan(
		&donation.ID,
		&donation.UserID,
		&donation.TeacherID,
		&donation.YearID,
		&donation.Price,
		&donation.ReceivedAt,
	)
	if err != nil {
		return domain.CampusDonation{}, err
	}

	return donation, nil
}

func (cdr *campusDonationRepository) GetBuildingFloorDonationsByYear(
	ctx context.Context,
	year int,
	groupKey *string,
	floorNumber *string,
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
		Order(
			goqu.I("buildings.unit_number").Asc(),
			goqu.I("buildings.id").Asc(),
			goqu.I("rooms.floor_number").Asc(),
			goqu.I("rooms.room_name").Asc(),
			goqu.I("teachers.name").Asc(),
		)

	if groupKey != nil && *groupKey != "" {
		queryDataset = queryDataset.Where(goqu.I("buildings.group_key").Eq(*groupKey))
	}

	if floorNumber != nil && *floorNumber != "" {
		queryDataset = queryDataset.Where(goqu.I("rooms.floor_number").Eq(*floorNumber))
	}

	query, args, err := queryDataset.ToSQL()
	if err != nil {
		return nil, err
	}

	return cdr.client.DB().QueryContext(ctx, query, args...)
}

func selectCampusDonationQuery() *goqu.SelectDataset {
	return dialect.
		From(goqu.T("campus_donations")).
		Select(
			goqu.I("campus_donations.id").As("id"),
			goqu.I("campus_donations.user_id").As("user_id"),
			goqu.I("campus_donations.teacher_id").As("teacher_id"),
			goqu.I("campus_donations.year_id").As("year_id"),
			goqu.I("campus_donations.price").As("price"),
			goqu.L("DATE_FORMAT(campus_donations.received_at, '%Y-%m-%d')").As("received_at"),
		)
}
