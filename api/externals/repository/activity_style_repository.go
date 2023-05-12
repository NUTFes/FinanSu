package repository

import (
	"context"
	"database/sql"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
)

type activityStyleRepository struct {
	client db.Client
	crud   abstract.Crud
}

type ActivityStyleRepository interface {
	All(context.Context) (*sql.Rows, error)
	Find(context.Context, string) (*sql.Row, error)
	Create(context.Context, string, string) error
	Update(context.Context, string, string, string) error
	Destroy(context.Context, string) error
	FindLatestRecord(context.Context) (*sql.Row, error)
}

func NewActivityStyleRepository(c db.Client, ac abstract.Crud) ActivityStyleRepository {
	return &activityStyleRepository{c, ac}
}

// 全件取得
func (ar *activityStyleRepository) All(c context.Context) (*sql.Rows, error) {
	query := "SELECT * FROM activity_styles"
	return ar.crud.Read(c, query)
}

// 1件取得
func (ar *activityStyleRepository) Find(c context.Context, id string) (*sql.Row, error) {
	query := "SELECT * FROM activity_styles WHERE id =" + id
	return ar.crud.ReadByID(c, query)
}

// 作成
func (ar *activityStyleRepository) Create(
	c context.Context,
	activityID string,
	sponsorStyleID string,
	) error {

	query := `
	INSERT INTO	activity_styles
		(activity_id , sponsor_style_id)
	VALUES
		(` +activityID + "," + sponsorStyleID +")"

	return ar.crud.UpdateDB(c, query)
}

// 編集
func (ar *activityStyleRepository) Update(
	c context.Context,
	id string,
	activityID string,
	sponsorStyleID string,
	) error {

	query := `
	UPDATE activity_styles
	SET
		activity_id = ` + activityID +
		", sponsor_style_id = " + sponsorStyleID +
		" where id = " + id

	return ar.crud.UpdateDB(c, query)
}

// 削除
func (ar *activityStyleRepository) Destroy(c context.Context, id string) error {
	query := "DELETE FROM activity_styles WHERE id = " + id
	return ar.crud.UpdateDB(c, query)
}

func (ar *activityStyleRepository) FindLatestRecord(c context.Context) (*sql.Row, error) {
	query := `
		SELECT
			*
		FROM
			activity_styles
		ORDER BY
			id
		DESC LIMIT 1
	`
	return ar.crud.ReadByID(c, query)
}
