package repository

import (
	"context"
	"database/sql"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
)

type activityInformationRepository struct {
	client db.Client
	crud   abstract.Crud
}

type ActivityInformationRepository interface {
	All(context.Context) (*sql.Rows, error)
	Find(context.Context, string) (*sql.Row, error)
	Create(context.Context, string, string, string, string, string, string) error
	Update(context.Context, string, string, string, string, string, string, string) error
	Destroy(context.Context, string) error
	FindLatestRecord(context.Context) (*sql.Row, error)
}

func NewActivityInformationsRepository(c db.Client, ac abstract.Crud) ActivityInformationRepository {
	return &activityInformationRepository{c, ac}
}

// 全件取得
func (ar *activityInformationRepository) All(c context.Context) (*sql.Rows, error) {
	query := "SELECT * FROM activity_informations"
	return ar.crud.Read(c, query)
}

// 1件取得
func (ar *activityInformationRepository) Find(c context.Context, id string) (*sql.Row, error) {
	query := "SELECT * FROM activity_informations WHERE id =" + id
	return ar.crud.ReadByID(c, query)
}

// 作成
func (ar *activityInformationRepository) Create(
	c context.Context,
	activityId string,
	bucketName string,
	fileName string,
	fileType string,
	designProgress string,
	fileInformation string,
	) error {

	query := `
	INSERT INTO	activity_informations
		(activity_id, bucket_name, file_name, file_type, design_progress, file_information)
	VALUES
		(` + activityId + `, "` + bucketName + `", "` + fileName +`", "` + fileType + `", ` + designProgress +`, "` + fileInformation +`")`

	return ar.crud.UpdateDB(c, query)
}

// 編集
func (ar *activityInformationRepository) Update(
	c context.Context,
	id string,
	activityId string,
	bucketName string,
	fileName string,
	fileType string,
	designProgress string,
	fileInformation string,
	) error {

	query := `
	UPDATE activity_informations
	SET
		activity_id = ` + activityId +
		`, bucket_name = "` + bucketName +
		`", file_name = "` + fileName +
		`", file_type = "` + fileType +
		`", design_progress = ` + designProgress +
		`, file_information = "` + fileInformation +
		`" where id = ` + id

	return ar.crud.UpdateDB(c, query)
}

// 削除
func (ar *activityInformationRepository) Destroy(c context.Context, id string) error {
	query := "DELETE FROM activity_informations WHERE id = " + id
	return ar.crud.UpdateDB(c, query)
}

// 最新のレコードを取得
func (ar *activityInformationRepository) FindLatestRecord(c context.Context) (*sql.Row, error) {
	query := `
		SELECT
			*
		FROM
			activity_informations
		ORDER BY
			id
		DESC LIMIT 1
	`
	return ar.crud.ReadByID(c, query)
}
