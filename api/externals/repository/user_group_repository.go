package repository

import (
	"context"
	"database/sql"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
	goqu "github.com/doug-martin/goqu/v9"
	_ "github.com/doug-martin/goqu/v9/dialect/mysql"
)

type userGroupRepository struct {
	client db.Client
	crud   abstract.Crud
}

type UserGroupRepository interface {
	GetGroupIDs(context.Context, int) ([]int, error)
	BulkInsert(context.Context, *sql.Tx, int, []int) error
	BulkDelete(context.Context, *sql.Tx, int, []int) error
	DeleteAllByUserID(context.Context, *sql.Tx, int) error
}

func NewUserGroupRepository(client db.Client, crud abstract.Crud) UserGroupRepository {
	return &userGroupRepository{
		client: client,
		crud:   crud,
	}
}

// 指定した userID に紐づく group_id の一覧を返す。
func (r *userGroupRepository) GetGroupIDs(ctx context.Context, userID int) ([]int, error) {
	queryDataset := goqu.Dialect("mysql").From("user_groups").Select("group_id").Where(goqu.I("user_id").Eq(userID))

	query, args, err := queryDataset.ToSQL()
	if err != nil {
		return nil, err
	}

	rows, err := r.client.DB().QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// 取得したデータを1行ずつスライス
	var groupIDs []int
	for rows.Next() {
		var groupID int
		if err := rows.Scan(&groupID); err != nil {
			return nil, err
		}
		groupIDs = append(groupIDs, groupID)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return groupIDs, nil
}

// 複数の (user_id, group_id) をDBにいれる。
func (r *userGroupRepository) BulkInsert(ctx context.Context, tx *sql.Tx, userID int, groupIDs []int) error {
	if len(groupIDs) == 0 {
		return nil
	}

	// レコード作成
	var userGroupRecords []goqu.Record
	for _, groupID := range groupIDs {
		userGroupRecords = append(userGroupRecords, goqu.Record{
			"user_id":  userID,
			"group_id": groupID,
		})
	}

	queryDataset := goqu.Dialect("mysql").Insert("user_groups").Rows(userGroupRecords)
	query, args, err := queryDataset.ToSQL()
	if err != nil {
		return err
	}

	_, err = tx.ExecContext(ctx, query, args...)
	return err
}

// 指定された groupIDs を削除。
func (r *userGroupRepository) BulkDelete(ctx context.Context, tx *sql.Tx, userID int, groupIDs []int) error {
	if len(groupIDs) == 0 {
		return nil
	}

	queryDataset := goqu.Dialect("mysql").Delete("user_groups").Where(
		goqu.I("user_id").Eq(userID),
		goqu.I("group_id").In(groupIDs),
	)

	query, args, err := queryDataset.ToSQL()
	if err != nil {
		return err
	}

	_, err = tx.ExecContext(ctx, query, args...)
	return err
}

// 指定 userID に紐づくやつを削除します。
func (r *userGroupRepository) DeleteAllByUserID(ctx context.Context, tx *sql.Tx, userID int) error {
	queryDataset := goqu.Dialect("mysql").Delete("user_groups").Where(goqu.I("user_id").Eq(userID))

	query, args, err := queryDataset.ToSQL()
	if err != nil {
		return err
	}

	_, err = tx.ExecContext(ctx, query, args...)
	return err
}
