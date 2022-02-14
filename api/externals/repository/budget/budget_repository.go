package budget

import (
	"database/sql"
	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/pkg/errors"
)

// 全件取得
func All() (*sql.Rows, error) {
	// データベース接続
	db := db.GetDB()

	rows, err := db.Query("select * from budgets")
	if err != nil {
		return nil, errors.Wrapf(err, "cannot connect SQL")
	}
	return rows, nil
}

// 1件取得
func Find(id string) *sql.Row {
	// データベース接続
	db := db.GetDB()

	row := db.QueryRow("select * from budgets where id = " + id)
	return row
}

// 作成
func Create(price string, yearID string, sourceID string) error {
	db := db.GetDB()
	_, err := db.Exec("insert into budgets (price, year_id, source_id) values (" + price + "," + yearID + "," + sourceID + ")")
	return err
}

// 編集
func Update(id string, price string, yearID string, sourceID string) error {
	db := db.GetDB()
	_, err := db.Exec("update budgets set price = " + price + ", year_id = " + yearID + ", source_id = " + sourceID + " where id = " + id)
	return err
}

// 削除
func Destroy(id string) error {
	db := db.GetDB()
	_, err := db.Exec("delete from budgets where id = " + id)
	return err
}
