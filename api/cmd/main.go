package main

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/NUTFes/finansu/api/internal/di"
	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func connect() {
	// データベース接続部分
	dbconf := "finansu:password@tcp(nutfes-finansu-db:3306)/finansu_db?charset=utf8mb4&parseTime=true"
	var err error
	DB, err = sql.Open("mysql", dbconf)

	if err != nil {
		log.Println(err.Error())
	}

	err = DB.Ping()

	if err != nil {
		fmt.Println("[Failed] Not Connect to MySQL") // 失敗
		log.Println(err.Error())
	} else {
		fmt.Println("[Success] Connect to MySQL") // 成功
	}
}

// Budgetsの取得
// func GetBudgets() echo.HandlerFunc {
// 	return func(c echo.Context) error {
//
// 		budget := Budget{}
// 		var budgets []Budget
//
// 		// クエリー実行
// 		rows, err := DB.Query("select * from budgets")
// 		if err != nil {
// 			return errors.Wrapf(err, "cannot connect SQL")
// 		}
// 		defer rows.Close()
//
// 		for rows.Next() {
// 			err := rows.Scan(&budget.ID, &budget.Price, &budget.YearID, &budget.SourceID, &budget.CreatedAt, &budget.UpdatedAt)
// 			if err != nil {
// 				return errors.Wrapf(err, "cannot connect SQL")
// 			}
// 			budgets = append(budgets, budget)
// 		}
// 		return c.JSON(http.StatusOK, budgets)
// 	}
// }
//
// type Budget struct {
// 	ID        int       `json:"id"`
// 	Price     int       `json:"price"`
// 	YearID    int       `json:"year_id"`
// 	SourceID  int       `json:"source_id"`
// 	CreatedAt time.Time `json:"created_at"`
// 	UpdatedAt time.Time `json:"updated_at"`
// }

func main() {

	// - echoのinstanceのpackage + DI

	s, err := di.InitializeServer()
	if err != nil {
		log.Fatalf("%v", err)
	}

	// サーバー起動
	s.Run()

	// データベースに接続
	connect()
}
