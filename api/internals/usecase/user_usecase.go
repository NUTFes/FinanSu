package usecase

import (
	"context"
	"database/sql"
	"log"
	"strconv"

	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/pkg/errors"
)

type userUseCase struct {
	userRep    rep.UserRepository
	sessionRep rep.SessionRepository
}

type UserUseCase interface {
	GetUsers(context.Context) ([]domain.User, error)
	GetUserByID(context.Context, string) (domain.User, error)
	CreateUser(context.Context, string, string, string) (domain.User, error)
	UpdateUser(context.Context, string, string, string, string) (domain.User, error)
	DestroyUser(context.Context, string) error
	DestroyMultiUsers(context.Context, []int) error
	GetCurrentUser(context.Context, string) (domain.User, error)
}

func NewUserUseCase(userRep rep.UserRepository, sessionRep rep.SessionRepository) UserUseCase {
	return &userUseCase{userRep: userRep, sessionRep: sessionRep}
}

func (u *userUseCase) GetUsers(c context.Context) ([]domain.User, error) {

	user := domain.User{}
	var users []domain.User

	rows, err := u.userRep.All(c)
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
			&user.ID,
			&user.Name,
			&user.BureauID,
			&user.RoleID,
			&user.IsDeleted,
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
	if err != nil {
		return user, err
	}

	err = row.Scan(
		&user.ID,
		&user.Name,
		&user.BureauID,
		&user.RoleID,
		&user.IsDeleted,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return user, err
	}

	return user, nil
}

func (u *userUseCase) CreateUser(c context.Context, name string, bureauID string, roleID string) (domain.User, error) {
	latastUser := domain.User{}
	err := u.userRep.Create(c, name, bureauID, roleID)
	if err != nil {
		return latastUser, err
	}

	row, err := u.userRep.FindNewRecord(c)
	if err != nil {
		return latastUser, err
	}

	err = row.Scan(
		&latastUser.ID,
		&latastUser.Name,
		&latastUser.BureauID,
		&latastUser.RoleID,
		&latastUser.IsDeleted,
		&latastUser.CreatedAt,
		&latastUser.UpdatedAt,
	)
	if err != nil {
		return latastUser, err
	}
	return latastUser, err
}

func (u *userUseCase) UpdateUser(c context.Context, id string, name string, bureauID string, roleID string) (domain.User, error) {
	var updatedUser domain.User
	if err := u.userRep.Update(c, id, name, bureauID, roleID); err != nil {
		return updatedUser, err
	}

	row, err := u.userRep.Find(c, id)
	if err != nil {
		return updatedUser, err
	}

	err = row.Scan(
		&updatedUser.ID,
		&updatedUser.Name,
		&updatedUser.BureauID,
		&updatedUser.RoleID,
		&updatedUser.IsDeleted,
		&updatedUser.CreatedAt,
		&updatedUser.UpdatedAt,
	)
	if err != nil {
		return updatedUser, err
	}
	return updatedUser, nil
}

func (u *userUseCase) DestroyUser(c context.Context, id string) error {
	err := u.userRep.Destroy(c, id)
	return err
}

func (u *userUseCase) DestroyMultiUsers(c context.Context, ids []int) error {
	err := u.userRep.MultiDestroy(c, ids)
	return err
}

func (u *userUseCase) GetCurrentUser(c context.Context, accessToken string) (domain.User, error) {
	var session = domain.Session{}
	var user = domain.User{}
	var row *sql.Row
	var err error
	// アクセストークンからmail_authを取得
	row = u.sessionRep.FindSessionByAccessToken(c, accessToken)
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
	if err != nil {
		return user, err
	}

	err = row.Scan(
		&user.ID,
		&user.Name,
		&user.BureauID,
		&user.RoleID,
		&user.IsDeleted,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		return user, err
	}
	return user, nil
}
