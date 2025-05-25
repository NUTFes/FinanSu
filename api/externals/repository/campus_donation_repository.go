package repository

import (
	"context"
	"database/sql"
	"log"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
	goqu "github.com/doug-martin/goqu/v9"
)

type campusDonationRepository struct {
	client db.Client
	crud   abstract.Crud
}

type CampusDonationRepository interface {
	AllCampusDonationByFloor(context.Context, string, string) (*sql.Rows, error)
	AllBuildingsByPeriod(context.Context, string) (*sql.Rows, error)
}

func NewCampusDonationRepository(c db.Client, ac abstract.Crud) CampusDonationRepository {
	return &campusDonationRepository{c, ac}
}

func (cdr *campusDonationRepository) AllCampusDonationByFloor(c context.Context, buildingId string, floorId string) (*sql.Rows, error) {

	query, _, err := dialect.From("buildings").
		Join(
			goqu.T("building_units"),
			goqu.On(goqu.Ex{"building_units.building_id": goqu.I("buildings.id")}),
		).
		Join(
			goqu.T("floors"),
			goqu.On(goqu.Ex{"floors.building_unit_id": goqu.I("building_units.id")}),
		).
		Join(
			goqu.T("rooms"),
			goqu.On(goqu.Ex{"rooms.floor_id": goqu.I("floors.id")}),
		).
		Join(
			goqu.T("room_teachers"),
			goqu.On(goqu.Ex{"room_teachers.room_id": goqu.I("rooms.id")}),
		).
		Join(
			goqu.T("teachers"),
			goqu.On(goqu.Ex{"teachers.id": goqu.I("room_teachers.teacher_id")}),
		).
		LeftJoin(
			goqu.T("campus_donations"),
			goqu.On(goqu.Ex{"campus_donations.teacher_id": goqu.I("teachers.id")}),
		).
		Select(
			goqu.I("buildings.id").As("building_id"),
			goqu.I("buildings.name").As("building_name"),
			goqu.I("floors.id").As("floor_id"),
			goqu.I("floors.floor_number").As("floor_number"),
			goqu.I("teachers.id").As("teacher_id"),
			goqu.I("teachers.name").As("teacher_name"),
			goqu.I("rooms.room_name").As("room_name"),
			goqu.I("campus_donations.price").As("price"),
			goqu.I("teachers.is_black").As("is_black"),
		).
		Where(
			goqu.Ex{"buildings.id": buildingId, "floors.id": floorId},
		).
		Order(
			goqu.I("building_units.unit_number").Asc(),
			goqu.I("floors.floor_number").Asc(),
		).
		ToSQL()

	if err != nil {
		log.Fatal(err)
	}

	return cdr.crud.Read(c, query)

}

func (fir *campusDonationRepository) AllBuildingsByPeriod(c context.Context, year string) (*sql.Rows, error) {

	ds := dialect.From("campus_donations").
		Select(
			goqu.I("buildings.id"),
			goqu.I("buildings.name"),
			goqu.I("campus_donations.price"),
		).
		Join(goqu.T("teachers"), goqu.On(goqu.Ex{
			"campus_donations.teacher_id": goqu.I("teachers.id"),
		})).
		Join(goqu.T("users"), goqu.On(goqu.Ex{
			"campus_donations.user_id": goqu.I("users.id"),
		})).
		Join(goqu.T("departments"), goqu.On(goqu.Ex{
			"teachers.department_id": goqu.I("departments.id"),
		})).
		Join(goqu.T("room_teachers"), goqu.On(goqu.Ex{
			"room_teachers.teacher_id": goqu.I("teachers.id"),
		})).
		Join(goqu.T("rooms"), goqu.On(goqu.Ex{
			"room_teachers.room_id": goqu.I("rooms.id"),
		})).
		Join(goqu.T("floors"), goqu.On(goqu.Ex{
			"rooms.floor_id": goqu.I("floors.id"),
		})).
		Join(goqu.T("building_units"), goqu.On(goqu.Ex{
			"floors.building_unit_id": goqu.I("building_units.id"),
		})).
		Join(goqu.T("buildings"), goqu.On(goqu.Ex{
			"building_units.building_id": goqu.I("buildings.id"),
		})).
		Join(goqu.T("year_periods"),
			goqu.On(goqu.And(
				goqu.I("campus_donations.created_at").Gt(goqu.I("year_periods.started_at")),
				goqu.I("campus_donations.created_at").Lt(goqu.I("year_periods.ended_at")),
			)),
		).
		Join(goqu.T("years"), goqu.On(goqu.Ex{
			"year_periods.year_id": goqu.I("years.id"),
		})).
		Where(goqu.Ex{"years.year": year}).
		Order(goqu.I("campus_donations.updated_at").Desc())

	query, _, err := ds.ToSQL()
	if err != nil {
		panic(err)
	}

	return fir.crud.Read(c, query)
}
