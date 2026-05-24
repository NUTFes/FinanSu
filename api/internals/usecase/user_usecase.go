package usecase

import (
	"context"
	"database/sql"
	"log"
	"strconv"

	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/generated"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/pkg/errors"
)

type userUseCase struct {
	userRep         rep.UserRepository
	sessionRep      rep.SessionRepository
	userGroupRep    rep.UserGroupRepository
	divisionRep     rep.DivisionRepository
	yearRep         rep.YearRepository
	transactionRepo rep.TransactionRepository
}

type UserUseCase interface {
	GetUsers(context.Context, *[]int) ([]domain.User, error)
	GetUserByID(context.Context, string) (domain.User, error)
	CreateUser(context.Context, string, string, string) (domain.User, error)
	UpdateUser(context.Context, string, string, string, string) (domain.User, error)
	DestroyUser(context.Context, string) error
	DestroyMultiUsers(context.Context, []int) error
	GetCurrentUser(context.Context, string) (domain.User, error)
	UpdateUserGroups(context.Context, int, int, []int) (*generated.UpdateUserGroupsResponse, error)
}

func NewUserUseCase(userRep rep.UserRepository, sessionRep rep.SessionRepository, userGroupRep rep.UserGroupRepository, divisionRep rep.DivisionRepository, yearRep rep.YearRepository, transactionRepo rep.TransactionRepository) UserUseCase {
	return &userUseCase{userRep: userRep, sessionRep: sessionRep, userGroupRep: userGroupRep, divisionRep: divisionRep, yearRep: yearRep, transactionRepo: transactionRepo}
}

func (u *userUseCase) GetUsers(c context.Context, ids *[]int) ([]domain.User, error) {
	user := domain.User{}
	var users []domain.User

	var rows *sql.Rows
	var err error

	if ids == nil {
		rows, err = u.userRep.All(c)
	} else if len(*ids) == 0 {
		return []domain.User{}, nil
	} else {
		rows, err = u.userRep.FindByIDs(c, *ids)
	}

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

// ユーザーの所属部門を差分更新する処理のメソッド
func (u *userUseCase) UpdateUserGroups(ctx context.Context, userID int, year int, requestGroupIDs []int) (updatedUserGroupsResponse *generated.UpdateUserGroupsResponse, err error) {
	updatedUserGroupsResponse = &generated.UpdateUserGroupsResponse{GroupIds: []int{}}

	// リクエスト配列の重複排除
	uniqueGroupIDs := make([]int, 0, len(requestGroupIDs))
	seenGroupIDs := make(map[int]struct{}, len(requestGroupIDs))
	for _, id := range requestGroupIDs {
		if _, ok := seenGroupIDs[id]; !ok {
			seenGroupIDs[id] = struct{}{}
			uniqueGroupIDs = append(uniqueGroupIDs, id)
		}
	}
	requestGroupIDs = uniqueGroupIDs

	// ユーザー存在確認
	userRow, err := u.userRep.Find(ctx, strconv.Itoa(userID))
	if err != nil {
		return nil, errors.New("user not found")
	}
	var userRecord domain.User
	if err := userRow.Scan(
		&userRecord.ID,
		&userRecord.Name,
		&userRecord.BureauID,
		&userRecord.RoleID,
		&userRecord.IsDeleted,
		&userRecord.CreatedAt,
		&userRecord.UpdatedAt,
	); err != nil {
		return nil, errors.New("user not found")
	}

	// 年度存在確認
	yearRows, err := u.yearRep.All(ctx)
	if err != nil {
		return nil, errors.New("year not found")
	}
	defer func() {
		if err := yearRows.Close(); err != nil {
			log.Println(err)
		}
	}()
	isYearFound := false
	for yearRows.Next() {
		var yearRecord domain.Year
		if err := yearRows.Scan(&yearRecord.ID, &yearRecord.Year, &yearRecord.CreatedAt, &yearRecord.UpdatedAt); err != nil {
			return nil, errors.New("year not found")
		}
		if yearRecord.Year == year {
			isYearFound = true
			break
		}
	}
	if err := yearRows.Err(); err != nil {
		return nil, errors.New("year not found")
	}
	if !isYearFound {
		return nil, errors.New("year not found")
	}

	// 指定された年度に存在するグループIDの取得
	validGroupIdRows, err := u.divisionRep.GetDivisionsYears(ctx, strconv.Itoa(year))
	if err != nil {
		return nil, err
	}
	validGroupIDs, err := u.scanDivisionIDs(validGroupIdRows)
	if err != nil {
		return nil, err
	}

	// リクエストされた groupIDs が、指定された年度に存在するグループIDの中に全て含まれているかを調べる
	if len(requestGroupIDs) > 0 {
		validGroupIDSet := make(map[int]struct{}, len(validGroupIDs))
		for _, groupID := range validGroupIDs {
			validGroupIDSet[groupID] = struct{}{}
		}
		for _, groupID := range requestGroupIDs {
			if _, ok := validGroupIDSet[groupID]; !ok {
				return nil, errors.New("invalid group id")
			}
		}
	}

	// 既存の所属グループIDを取得
	existingGroupIdRows, err := u.divisionRep.GetDivisionOptionsByUserId(ctx, strconv.Itoa(year), strconv.Itoa(userID))
	if err != nil {
		return nil, err
	}
	existingGroupIDs, err := u.scanDivisionIDs(existingGroupIdRows)
	if err != nil {
		return nil, err
	}

	// トランザクションを開始
	tx, err := u.transactionRepo.StartTransaction(ctx)
	if err != nil {
		return nil, err
	}

	err = func(tx *sql.Tx) error {
		// Diff処理
		groupIDsToDelete, groupIDsToInsert := domain.GroupIDs(existingGroupIDs).Diff(domain.GroupIDs(requestGroupIDs))
		// 差分に基づいて追加
		if len(groupIDsToInsert) > 0 {
			if err := u.userGroupRep.BulkInsert(ctx, tx, userID, groupIDsToInsert); err != nil {
				return err
			}
		}
		// 差分に基づいて削除
		if len(groupIDsToDelete) > 0 {
			if err := u.userGroupRep.BulkDelete(ctx, tx, userID, groupIDsToDelete); err != nil {
				return err
			}
		}
		return u.transactionRepo.Commit(ctx, tx)
	}(tx)

	if err != nil {
		if rollbackErr := u.transactionRepo.RollBack(ctx, tx); rollbackErr != nil {
			log.Println(rollbackErr)
		}
		return nil, err
	}

	// グループIDをそのまま返却
	updatedUserGroupsResponse.GroupIds = requestGroupIDs
	return updatedUserGroupsResponse, nil
}

// *sql.Rows から division_id だけを抽出する関数
func (u *userUseCase) scanDivisionIDs(rows *sql.Rows) ([]int, error) {
	defer func() {
		if err := rows.Close(); err != nil {
			log.Println(err)
		}
	}()

	var divisionIDs []int
	for rows.Next() {
		var divisionID int
		var unusedName string
		if err := rows.Scan(&divisionID, &unusedName); err != nil {
			return nil, err
		}
		divisionIDs = append(divisionIDs, divisionID)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return divisionIDs, nil
}
