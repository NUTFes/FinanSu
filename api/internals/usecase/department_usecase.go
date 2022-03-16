package usecase

import (
	"context"
	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/pkg/errors"
)

type departmentUseCase struct {
	rep rep.DepartmentRepository
}

type DepartmentUseCase interface {
	GetDepartments(context.Context) ([]domain.Department, error)
	GetDepartmentByID(context.Context, string) (domain.Department, error)
	CreateDepartment(context.Context, string) error
	UpdateDepartment(context.Context, string, string) error
	DestroyDepartment(context.Context, string) error
}

func NewDepartmentUseCase(rep rep.DepartmentRepository) DepartmentUseCase {
	return &departmentUseCase{rep}
}

func (d *departmentUseCase) GetDepartments(c context.Context) ([]domain.Department, error) {

	department := domain.Department{}
	var departments []domain.Department

	// クエリー実行
	rows, err := d.rep.All(c)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		err := rows.Scan(
			&department.ID,
			&department.Name,
			&department.CreatedAt,
			&department.UpdatedAt,
		)

		if err != nil {
			return nil, errors.Wrapf(err, "cannot connect SQL")
		}

		departments = append(departments, department)
	}
	return departments, nil
}

func (d *departmentUseCase) GetDepartmentByID(c context.Context, id string) (domain.Department, error) {
	var department domain.Department

	row, err := d.rep.Find(c, id)
	err = row.Scan(
		&department.ID,
		&department.Name,
		&department.CreatedAt,
		&department.UpdatedAt,
	)

	if err != nil {
		return department, err
	}

	return department, nil
}

func (d *departmentUseCase) CreateDepartment(c context.Context, name string) error {
	err := d.rep.Create(c, name)
	return err
}

func (d *departmentUseCase) UpdateDepartment(c context.Context, id string, name string) error {
	err := d.rep.Update(c, id, name)
	return err
}

func (d *departmentUseCase) DestroyDepartment(c context.Context, id string) error {
	err := d.rep.Destroy(c, id)
	return err
}
