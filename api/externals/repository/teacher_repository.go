package repository

import (
	"context"
	"database/sql"
	"strconv"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
	goqu "github.com/doug-martin/goqu/v9"
)

type teacherRepository struct {
	client db.Client
	crud   abstract.Crud
}

type TeacherRepository interface {
	All(context.Context) (*sql.Rows, error)
	AllFundRegistered(context.Context, string) (*sql.Rows, error)
	Find(context.Context, string) (*sql.Row, error)
	Create(context.Context, string, string, string, string, string, string) error
	Update(context.Context, string, string, string, string, string, string, string) error
	Destroy(context.Context, string) error
	MultiDestroy(context.Context, []int) error
	FindLatestRecord(c context.Context) (*sql.Row, error)
}

func NewTeacherRepository(c db.Client, ac abstract.Crud) TeacherRepository {
	return &teacherRepository{c, ac}
}

func (t *teacherRepository) All(c context.Context) (*sql.Rows, error) {
	query, _, err := selectTeacherWithRoomQuery.
		ToSQL()
	if err != nil {
		return nil, err
	}
	return t.crud.Read(c, query)
}

func (t *teacherRepository) AllFundRegistered(c context.Context, year string) (*sql.Rows, error) {
	query := `
	SELECT
    teachers.id
	FROM
    teachers
	INNER JOIN
    fund_informations
	ON
    teachers.id = fund_informations.teacher_id
	INNER JOIN
    year_periods
	ON
    fund_informations.created_at > year_periods.started_at
	AND
    fund_informations.created_at < year_periods.ended_at
	INNER JOIN
    years
	ON
    year_periods.year_id = years.id
	WHERE
    years.year = ` + year + `
	ORDER BY
    fund_informations.created_at ASC;`
	return t.crud.Read(c, query)
}

func (t *teacherRepository) Find(c context.Context, id string) (*sql.Row, error) {
	query, _, err := selectTeacherWithRoomQuery.
		Where(goqu.Ex{"teachers.id": id}).
		ToSQL()
	if err != nil {
		return nil, err
	}
	return t.crud.ReadByID(c, query)
}

func (t *teacherRepository) Create(
	c context.Context,
	name string,
	position string,
	departmentID string,
	room string,
	isBlack string,
	remark string) error {
	query := `
	INSERT INTO teachers
		(name, position, department_id, room, is_black, remark) VALUES
	('` + name +
		"','" + position +
		"'," + departmentID +
		",'" + room +
		"'," + isBlack +
		",'" + remark +
		"')"
	return t.crud.UpdateDB(c, query)
}

func (t *teacherRepository) Update(
	c context.Context,
	id string,
	name string,
	position string,
	departmentID string,
	room string,
	isBlack string,
	remark string) error {
	query := `
	UPDATE teachers
	SET name ='` + name +
		"', position = '" + position +
		"', department_id = " + departmentID +
		", room = '" + room +
		"', is_black = " + isBlack +
		", remark = '" + remark +
		"' WHERE id = " + id
	return t.crud.UpdateDB(c, query)
}

func (t *teacherRepository) Destroy(c context.Context, id string) error {
	query := "UPDATE teachers SET is_deleted = TRUE WHERE id = " + id
	err := t.crud.UpdateDB(c, query)
	return err
}

func (t *teacherRepository) FindLatestRecord(c context.Context) (*sql.Row, error) {
	query := "SELECT * FROM teachers WHERE is_deleted IS FALSE ORDER BY id DESC LIMIT 1"
	return t.crud.ReadByID(c, query)
}

// 複数削除
func (t *teacherRepository) MultiDestroy(c context.Context, ids []int) error {
	query := "UPDATE teachers SET is_deleted = TRUE WHERE "
	for index, id := range ids {
		query += "id = " + strconv.Itoa(id)

		if index != len(ids)-1 {
			query += " OR "
		}

	}

	err := t.crud.UpdateDB(c, query)
	if err != nil {
		return err
	}

	return err
}

var selectTeacherWithRoomQuery = dialect.
	From("room_teachers").
	Join(
		goqu.T("teachers"),
		goqu.On(goqu.Ex{"room_teachers.teacher_id": goqu.I("teachers.id")}),
	).
	Join(
		goqu.T("rooms"),
		goqu.On(goqu.Ex{"room_teachers.room_id": goqu.I("rooms.id")}),
	).
	Select(
		goqu.I("teachers.id"),
		goqu.I("teachers.name"),
		goqu.I("teachers.position"),
		goqu.I("teachers.department_id"),
		goqu.I("teachers.is_black"),
		goqu.I("teachers.remark"),
		goqu.I("teachers.is_deleted"),
		goqu.I("rooms.room_name"),
	)
