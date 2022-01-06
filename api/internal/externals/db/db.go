package db

import (
	"database/sql"
	"fmt"
	"log"
	// ほんとはentityに書きたい奴
	// entity "github.com/NUTFes/finansu/api/internal/repositories"
)

type db struct {
	client *sql.DB
}

type DB interface {
	getDB()
	// GetBudget(string) (*entity.Budget, error)
}

// テスト
func (db db) getDB() {
	fmt.Println(db.client)
}

// データベース接続部分
func InitializeDB() *db {
	dbconf := "finansu:password@tcp(nutfes-finansu-db:3306)/finansu_db?charset=utf8mb4&parseTime=true"
	client, err := sql.Open("mysql", dbconf)

	if err != nil {
		log.Println(err.Error())
	}

	err = client.Ping()

	if err != nil {
		fmt.Println("[Failed] Not Connect to MySQL") // 失敗
		log.Println(err.Error())
	} else {
		fmt.Println("[Success] Connect to MySQL") // 成功
	}

	return &db{client: client}
}

// func (db *db) GetBudget(query string) (*entity.Budget, error) {
// 	rows, err := db.client.Query(query)
// 	if err != nil {
// 		return nil, fmt.Errorf("%w cannot connect SQL", err)
// 	}
// 	budget := entity.Budget{}
// 	err = rows.Scan(&budget.ID, &budget.Price, &budget.YearID, &budget.SourceID, &budget.CreatedAt, &budget.UpdatedAt)
// 	defer rows.Close()
//
// 	return &budget, nil
// }
