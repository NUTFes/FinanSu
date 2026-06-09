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
	BulkInsert(context.Context, *sql.Tx, int, []int) error
	BulkDelete(context.Context, *sql.Tx, int, []int) error
}

func NewUserGroupRepository(client db.Client, crud abstract.Crud) UserGroupRepository {
	return &userGroupRepository{
		client: client,
		crud:   crud,
	}
}

// 指定された (user_id, group_id) を登録。
func (r *userGroupRepository) BulkInsert(ctx context.Context, tx *sql.Tx, userID int, insertGroupIDs []int) error {
	if len(insertGroupIDs) == 0 {
		return nil
	}

	// レコード作成
	var userGroupRecords []goqu.Record
	for _, groupID := range insertGroupIDs {
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

// 指定された deleteGroupIDs を削除。
func (r *userGroupRepository) BulkDelete(ctx context.Context, tx *sql.Tx, userID int, deleteGroupIDs []int) error {
	if len(deleteGroupIDs) == 0 {
		return nil
	}

	queryDataset := goqu.Dialect("mysql").Delete("user_groups").Where(
		goqu.I("user_id").Eq(userID),
		goqu.I("group_id").In(deleteGroupIDs),
	)

	query, args, err := queryDataset.ToSQL()
	if err != nil {
		return err
	}

	_, err = tx.ExecContext(ctx, query, args...)
	return err
}
