package usecase

import (
	"context"
	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/pkg/errors"
)

type teacherUseCase struct {
	rep rep.TeacherRepository
}

type TeacherUseCase interface {
	GetTeachers(context.Context) ([]domain.Teacher, error)
	GetTeacherByID(context.Context, string) (domain.Teacher, error)
	CreateTeacher(context.Context, string, string, string, string, string, string) error
	UpdateTeacher(context.Context, string, string, string, string, string, string, string) error
	DestroyTeacher(context.Context, string) error
}

func NewTeacherUseCase(rep rep.TeacherRepository) TeacherUseCase {
	return &teacherUseCase{rep}
}

func (t *teacherUseCase) GetTeachers(c context.Context) ([]domain.Teacher, error) {

	teacher := domain.Teacher{}
	var teachers []domain.Teacher

	// クエリー実行
	rows, err := t.rep.All(c)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		err := rows.Scan(
			&teacher.ID,
			&teacher.Name,
			&teacher.Position,
			&teacher.DepartmentID,
			&teacher.Room,
			&teacher.IsBlack,
			&teacher.Remark,
			&teacher.CreatedAt,
			&teacher.UpdatedAt,
		)

		if err != nil {
			return nil, errors.Wrapf(err, "cannot connect SQL")
		}

		teachers = append(teachers, teacher)
	}
	return teachers, nil
}

func (t *teacherUseCase) GetTeacherByID(c context.Context, id string) (domain.Teacher, error) {
	var teacher domain.Teacher

	row, err := t.rep.Find(c, id)
	err = row.Scan(
		&teacher.ID,
		&teacher.Name,
		&teacher.Position,
		&teacher.DepartmentID,
		&teacher.Room,
		&teacher.IsBlack,
		&teacher.Remark,
		&teacher.CreatedAt,
		&teacher.UpdatedAt,
	)

	if err != nil {
		return teacher, err
	}

	return teacher, nil
}

func (t *teacherUseCase) CreateTeacher(c context.Context, name string, position string, departmentID string, room string, isBlack string, remark string) error {
	err := t.rep.Create(c, name, position, departmentID, room, isBlack, remark)
	return err
}

func (t *teacherUseCase) UpdateTeacher(c context.Context, id string, name string, position string, departmentID string, room string, isBlack string, remark string) error {
	err := t.rep.Update(c, id, name, position, departmentID, room, isBlack, remark)
	return err
}

func (t *teacherUseCase) DestroyTeacher(c context.Context, id string) error {
	err := t.rep.Destroy(c, id)
	return err
}
