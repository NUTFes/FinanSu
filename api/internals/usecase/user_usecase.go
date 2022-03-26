package usecase

import (
	"context"
	"database/sql"
	"fmt"
	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/pkg/errors"
	"strconv"
)

type userUseCase struct {
	userRep    rep.UserRepository
	sessionRep rep.SessionRepository
}

type UserUseCase interface {
	GetUsers(context.Context) ([]domain.User, error)
	GetUserByID(context.Context, string) (domain.User, error)
	CreateUser(context.Context, string, string) error
	UpdateUser(context.Context, string, string, string) error
	DestroyUser(context.Context, string) error
	GetCurrentUser(context.Context, string) (domain.User, error)
}

func NewUserUseCase(userRep rep.UserRepository, sessionRep rep.SessionRepository) UserUseCase {
	return &userUseCase{userRep: userRep, sessionRep: sessionRep}
}

func (u *userUseCase) GetUsers(c context.Context) ([]domain.User, error) {

	user := domain.User{}
	var users []domain.User

	// クエリー実行
	rows, err := u.userRep.All(c)
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

	row, err := u.userRep.Find(c, id)
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
	err := u.userRep.Create(c, name, departmentID)
	return err
}

func (u *userUseCase) UpdateUser(c context.Context, id string, name string, departmentID string) error {
	err := u.userRep.Update(c, id, name, departmentID)
	return err
}

func (u *userUseCase) DestroyUser(c context.Context, id string) error {
	err := u.userRep.Destroy(c, id)
	return err
}

func (u *userUseCase) GetCurrentUser(c context.Context, accessToken string) (domain.User, error) {
	var session = domain.Session{}
	var user = domain.User{}
	var row *sql.Row
	var err error
	// アクセストークンからmail_authを取得
	row = u.sessionRep.FindSessionByAccessToken(c, accessToken)
	fmt.Println(row)
	err = row.Scan(
		&session.ID,
		&session.AuthID,
		&session.UserID,
		&session.AccessToken,
		&session.CreatedAt,
		&session.UpdatedAt,
	)
	if err != nil {
		return user, err
	}

	// userIDの該当するuserを取得
	row, err = u.userRep.Find(c, strconv.Itoa(session.UserID))
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
