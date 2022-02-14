package db

import (
	"database/sql"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func connectMySQL() (*sql.DB, error) {
	// MySQLに接続する
	// データベース接続部分
	dbconf := "finansu:password@tcp(nutfes-finansu-db:3306)/finansu_db?charset=utf8mb4&parseTime=true"
	db, err := sql.Open("mysql", dbconf)

	if err != nil {
		return nil, err
	}

	err = db.Ping()

	if err != nil {
		fmt.Println("[Failed] Not Connect to MySQL") // 失敗
		return nil, err
	} else {
		fmt.Println("[Success] Connect to MySQL") // 成功
		return db, nil
	}
}

// Client
func GetClient() (*sql.DB, error) {
	var err error
	DB, err = connectMySQL()
	if err != nil {
		return nil, err
	}
	return DB, nil
}

func CloseDB() {
	if DB != nil {
		DB.Close()
	}
}

// DBの供給
func GetDB() *sql.DB {
	return DB
}
