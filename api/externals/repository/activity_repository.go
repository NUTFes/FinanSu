package repository

import (
	"context"
	"database/sql"
	"fmt"
	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/pkg/errors"
)

type activityRepository struct {
	client db.Client
}

type ActivityRepository interface {
	All(context.Context) (*sql.Rows, error)
	Find(context.Context, string) (*sql.Row, error)
	Create(context.Context, string, string, string, string) error
	Update(context.Context, string, string, string, string, string) error
	Destroy(context.Context, string) error
	AllWithSponser(context.Context) (*sql.Rows, error)
}

func NewActivityRepository(client db.Client) ActivityRepository {
	return &activityRepository{client}
}

// 全件取得
func (ar *activityRepository) All(c context.Context) (*sql.Rows, error) {
	rows, err := ar.client.DB().QueryContext(c, "select * from activities")
	fmt.Println(rows)
	if err != nil {
		return nil, errors.Wrapf(err, "cannot connect SQL")
	}
	return rows, nil
}

// 1件取得
func (ar *activityRepository) Find(c context.Context, id string) (*sql.Row, error) {
	row := ar.client.DB().QueryRowContext(c, "select * from activities where id = "+id)
	return row, nil
}

// 作成
func (ar *activityRepository) Create(c context.Context,  suponserStyleID string, userID string, isDone string, suponserID string) error {
	_, err := ar.client.DB().ExecContext(c, "insert into activities (suponser_style_id, user_id, is_done, suponser_id) values ("+suponserStyleID+","+userID+","+isDone+","+suponserID+")")
	return err
}

// 編集
func (ar *activityRepository) Update(c context.Context, id string, suponserStyleID string, userID string, isDone string, suponserID string) error {
	_, err := ar.client.DB().ExecContext(c, "update activities set suponser_style_id = "+suponserStyleID+", user_id = "+userID+", is_done = "+isDone+", suponser_id = "+suponserID+" where id = "+id)
	return err
}

// 削除
func (ar *activityRepository) Destroy(c context.Context, id string) error {
	_, err := ar.client.DB().ExecContext(c, "delete from activities where id = "+id)
	return err
}

func (ar *activityRepository) AllWithSponser(c context.Context) (*sql.Rows, error) {
	rows, err := ar.client.DB().QueryContext(c, "select * from activities inner join sponsors on activities.suponser_id = sponsors.id inner join sponsor_styles on activities.suponser_style_id = sponsor_styles.id inner join users on activities.user_id = users.id")
	fmt.Println(rows)
	if err != nil {
		return nil, errors.Wrapf(err, "cannot connect SQL")
	}
	return rows, nil
}