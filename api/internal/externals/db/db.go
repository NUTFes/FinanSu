package db

import (
	"database/sql"
	"fmt"
	"log"
)

type db struct {
	client *sql.DB
}

type DB interface {
	GetClient() *sql.DB
}

func (db *db) GetClient() *sql.DB {
	return db.client
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
