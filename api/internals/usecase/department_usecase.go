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
	CreateDepartment(context.Context, string) (domain.Department, error)
	UpdateDepartment(context.Context, string, string) (domain.Department, error)
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

func (d *departmentUseCase) CreateDepartment(c context.Context, name string) (domain.Department, error) {
	latastDepartment := domain.Department{}
	err := d.rep.Create(c, name)
	row, err := d.rep.FindLatestRecord(c)
	err = row.Scan(
		&latastDepartment.ID,
		&latastDepartment.Name,
		&latastDepartment.CreatedAt,
		&latastDepartment.UpdatedAt,
	)
	if err != nil {
		return latastDepartment, err
	}
	return latastDepartment, err
}

func (d *departmentUseCase) UpdateDepartment(c context.Context, id string, name string) (domain.Department, error) {
	updatedDepartment := domain.Department{}
	err := d.rep.Update(c, id, name)
	row, err := d.rep.Find(c,id)
	err = row.Scan(
		&updatedDepartment.ID,
		&updatedDepartment.Name,
		&updatedDepartment.CreatedAt,
		&updatedDepartment.UpdatedAt,
	)
	if err != nil {
		return updatedDepartment, err
	}
	return updatedDepartment, err
}

func (d *departmentUseCase) DestroyDepartment(c context.Context, id string) error {
	err := d.rep.Destroy(c, id)
	return err
}
