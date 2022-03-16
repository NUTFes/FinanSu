package usecase

import (
	"context"
	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/pkg/errors"
)

type userUseCase struct {
	rep rep.UserRepository
}

type UserUseCase interface {
	GetUsers(context.Context) ([]domain.User, error)
	GetUserByID(context.Context, string) (domain.User, error)
	CreateUser(context.Context, string, string) error
	UpdateUser(context.Context, string, string, string) error
	DestroyUser(context.Context, string) error
}

func NewUserUsecase(rep rep.UserRepository) UserUseCase {
	return &userUseCase{rep}
}

func (u *userUseCase) GetUsers(c context.Context) ([]domain.User, error) {

	user := domain.User{}
	var users []domain.User

	// クエリー実行
	rows, err := u.rep.All(c)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		err := rows.Scan(
			&user.ID,
			&user.Name,
			&user.DepartmentID,
			&user.CreatedAt,
			&user.UpdatedAt,
		)

		if err != nil {
			return nil, errors.Wrapf(err, "cannot connect SQL")
		}

		users = append(users, user)
	}
	return users, nil
}

func (u *userUseCase) GetUserByID(c context.Context, id string) (domain.User, error) {
	var user domain.User

	row, err := u.rep.Find(c, id)
	err = row.Scan(
		&user.ID,
		&user.Name,
		&user.DepartmentID,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return user, err
	}

	return user, nil
}

func (u *userUseCase) CreateUser(c context.Context, name string, departmentID string) error {
	err := u.rep.Create(c, name, departmentID)
	return err
}

func (u *userUseCase) UpdateUser(c context.Context, id string, name string, departmentID string) error {
	err := u.rep.Update(c, id, name, departmentID)
	return err
}

func (u *userUseCase) DestroyUser(c context.Context, id string) error {
	err := u.rep.Destroy(c, id)
	return err
}
