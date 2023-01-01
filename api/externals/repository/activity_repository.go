package repository

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
	"github.com/pkg/errors"
)

type activityRepository struct {
	client db.Client
	crud   abstract.Crud
}

type ActivityRepository interface {
	All(context.Context) (*sql.Rows, error)
	Find(context.Context, string) (*sql.Row, error)
	Create(context.Context, string, string, string, string) error
	Update(context.Context, string, string, string, string, string) error
	Destroy(context.Context, string) error
	AllWithSponsor(context.Context) (*sql.Rows, error)
}

func NewActivityRepository(c db.Client, ac abstract.Crud) ActivityRepository {
	return &activityRepository{c, ac}
}

// 全件取得
func (ar *activityRepository) All(c context.Context) (*sql.Rows, error) {
	query := "SELECT * FROM activities"
	return ar.crud.Read(c, query)
}

// 1件取得
func (ar *activityRepository) Find(c context.Context, id string) (*sql.Row, error) {
	query := "SELECT * FROM activities WHERE id =" + id
	row := ar.client.DB().QueryRowContext(c, query)
	fmt.Printf("\x1b[36m%s\n", query)
	return row, nil
}

// 作成
func (ar *activityRepository) Create(
	c context.Context,
	sponsorStyleID string,
	userID string,
	isDone string,
	sponsorID string) error {

	query := `
	INSERT INTO	activities
		(sponsor_style_id, user_id, is_done, sponsor_id)
	VALUES
		(` + sponsorStyleID + "," + userID + "," + isDone + "," + sponsorID + ")"

	_, err := ar.client.DB().ExecContext(c, query)
	fmt.Printf("\x1b[36m%s\n", query)
	return err
}

// 編集
func (ar *activityRepository) Update(
	c context.Context,
	id string,
	sponsorStyleID string,
	userID string,
	isDone string,
	sponsorID string) error {

	query := `
	UPDATE activities
	SET
		sponsor_style_id =` + sponsorStyleID +
		", user_id = " + userID +
		", is_done = " + isDone +
		", sponsor_id = " + sponsorID +
		" where id = " + id

	_, err := ar.client.DB().ExecContext(c, query)
	fmt.Printf("\x1b[36m%s\n", query)
	return err
}

// 削除
func (ar *activityRepository) Destroy(c context.Context, id string) error {

	query := "DELETE FROM activities WHERE id = " + id

	_, err := ar.client.DB().ExecContext(c, query)
	fmt.Printf("\x1b[36m%s\n", query)
	return err
}

func (ar *activityRepository) AllWithSponsor(c context.Context) (*sql.Rows, error) {
	query := `
	SELECT * FROM
		activities
	INNER JOIN
		sponsors
	ON
		activities.sponsor_id = sponsors.id
	INNER JOIN
		sponsor_styles
	ON
		activities.sponsor_style_id = sponsor_styles.id
	INNER JOIN
		users
	ON
		activities.user_id = users.id`

	rows, err := ar.client.DB().QueryContext(c, query)
	if err != nil {
		return nil, errors.Wrapf(err, "cannot connect SQL")
	}
	fmt.Printf("\x1b[36m%s\n", query)
	return rows, nil
}
