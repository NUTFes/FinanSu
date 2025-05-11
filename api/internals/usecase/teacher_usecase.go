package usecase

import (
	"context"
	"log"

	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/generated"
	"github.com/pkg/errors"
)

type teacherUseCase struct {
	rep rep.TeacherRepository
}

type TeacherUseCase interface {
	GetTeachers(context.Context) ([]TeacherWithRoom, error)
	GetFundRegisteredByPeriods(context.Context, string) ([]int, error)
	GetTeacherByID(context.Context, string) (TeacherWithRoom, error)
	CreateTeacher(context.Context, string, string, string, string, string, string) (TeacherWithRoom, error)
	UpdateTeacher(context.Context, string, string, string, string, string, string, string) (TeacherWithRoom, error)
	DestroyTeacher(context.Context, string) error
	DestroyMultiTeachers(context.Context, []int) error
}

func NewTeacherUseCase(rep rep.TeacherRepository) TeacherUseCase {
	return &teacherUseCase{rep}
}

func (t *teacherUseCase) GetTeachers(c context.Context) ([]TeacherWithRoom, error) {

	teacher := TeacherWithRoom{}
	var teachers []TeacherWithRoom

	// クエリー実行
	rows, err := t.rep.All(c)
	if err != nil {
		return nil, err
	}

	defer func() {
		if err := rows.Close(); err != nil {
			log.Println(err)
		}
	}()

	for rows.Next() {
		err := rows.Scan(
			&teacher.DepartmentId,
			&teacher.Id,
			&teacher.IsBlack,
			&teacher.Name,
			&teacher.Position,
			&teacher.Remark,
			&teacher.RoomName,
		)

		if err != nil {
			return nil, errors.Wrapf(err, "cannot connect SQL")
		}

		teachers = append(teachers, teacher)
	}
	return teachers, nil
}

func (t *teacherUseCase) GetFundRegisteredByPeriods(c context.Context, year string) ([]int, error) {

	rows, err := t.rep.AllFundRegistered(c, year)
	if err != nil {
		return nil, err
	}

	defer func() {
		if err := rows.Close(); err != nil {
			log.Println(err)
		}
	}()

	ids := []int{}
	for rows.Next() {
		var id int
		if err := rows.Scan(&id); err != nil {
			return nil, err
		}
		ids = append(ids, id)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return ids, nil
}

func (t *teacherUseCase) GetTeacherByID(c context.Context, id string) (TeacherWithRoom, error) {
	var teacher TeacherWithRoom

	row, err := t.rep.Find(c, id)
	if err != nil {
		return teacher, err
	}

	err = row.Scan(
		&teacher.DepartmentId,
		&teacher.Id,
		&teacher.IsBlack,
		&teacher.Name,
		&teacher.Position,
		&teacher.Remark,
		&teacher.RoomName,
	)

	if err != nil {
		return teacher, err
	}

	return teacher, nil
}

func (t *teacherUseCase) CreateTeacher(
	c context.Context,
	name string,
	position string,
	departmentID string,
	room string,
	isBlack string,
	remark string) (TeacherWithRoom, error) {
	latestTeacher := TeacherWithRoom{}

	if err := t.rep.Create(c, name, position, departmentID, room, isBlack, remark); err != nil {
		return latestTeacher, err
	}

	row, err := t.rep.FindLatestRecord(c)
	if err != nil {
		return latestTeacher, err
	}

	err = row.Scan(
		&latestTeacher.DepartmentId,
		&latestTeacher.Id,
		&latestTeacher.IsBlack,
		&latestTeacher.Name,
		&latestTeacher.Position,
		&latestTeacher.Remark,
		&latestTeacher.RoomName,
	)

	if err != nil {
		return latestTeacher, err
	}
	return latestTeacher, err
}

func (t *teacherUseCase) UpdateTeacher(
	c context.Context,
	id string,
	name string,
	position string,
	departmentID string,
	room string,
	isBlack string,
	remark string) (TeacherWithRoom, error) {
	updateTeacher := TeacherWithRoom{}

	if err := t.rep.Update(c, id, name, position, departmentID, room, isBlack, remark); err != nil {
		return TeacherWithRoom{}, err
	}

	row, err := t.rep.Find(c, id)
	if err != nil {
		return TeacherWithRoom{}, err
	}

	err = row.Scan(
		&updateTeacher.DepartmentId,
		&updateTeacher.Id,
		&updateTeacher.IsBlack,
		&updateTeacher.Name,
		&updateTeacher.Position,
		&updateTeacher.Remark,
		&updateTeacher.RoomName,
	)

	if err != nil {
		return updateTeacher, err
	}
	return updateTeacher, err
}

func (t *teacherUseCase) DestroyTeacher(c context.Context, id string) error {
	err := t.rep.Destroy(c, id)
	return err
}

func (t *teacherUseCase) DestroyMultiTeachers(c context.Context, ids []int) error {
	err := t.rep.MultiDestroy(c, ids)
	return err
}

type TeacherWithRoom generated.TeacherWithRoom
