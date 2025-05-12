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
			goqu.T("fund_informations"),
			goqu.On(goqu.Ex{"fund_informations.teacher_id": goqu.I("teachers.id")}),
		).
		Select(
			goqu.I("buildings.id").As("building_id"),
			goqu.I("buildings.name").As("building_name"),
			goqu.I("floors.id").As("floor_id"),
			goqu.I("floors.floor_number").As("floor_number"),
			goqu.I("teachers.id").As("teacher_id"),
			goqu.I("teachers.name").As("teacher_name"),
			goqu.I("rooms.room_name").As("room_name"),
			goqu.I("fund_informations.price").As("price"),
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
