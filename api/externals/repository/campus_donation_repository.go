package repository

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
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
	query := `
		SELECT
			donation_buildings.building_id,
			donation_buildings.building_name,
			SUM(donation_buildings.price) AS total_price
		FROM (
			SELECT DISTINCT
				campus_donations.id AS donation_id,
				buildings.id AS building_id,
				buildings.name AS building_name,
				campus_donations.price AS price
			FROM
				campus_donations
			INNER JOIN
				teachers
			ON
				campus_donations.teacher_id = teachers.id
			INNER JOIN
				room_teachers
			ON
				room_teachers.teacher_id = teachers.id
			INNER JOIN
				rooms
			ON
				room_teachers.room_id = rooms.id
			INNER JOIN
				buildings
			ON
				rooms.building_id = buildings.id
			INNER JOIN
				years
			ON
				campus_donations.year_id = years.id
			WHERE
				years.year = ?
		) AS donation_buildings
		GROUP BY
			donation_buildings.building_id,
			donation_buildings.building_name
		ORDER BY
			donation_buildings.building_id ASC;
	`

	stmt, err := cdr.crud.Prepare(c, query)
	if err != nil {
		return nil, err
	}
	defer func() {
		if err := stmt.Close(); err != nil {
			fmt.Println(err)
		}
	}()

	return stmt.QueryContext(c, year)
}
