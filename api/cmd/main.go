package main

import (
	"fmt"
	"log"

	"github.com/NUTFes/finansu/api/internal/di"
	_ "github.com/go-sql-driver/mysql"
)

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

	// データベースに接続
	db, err := di.InitializeDB()
	fmt.Println(db)

	// サーバー起動
	s.Run()

}
