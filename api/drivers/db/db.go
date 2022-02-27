package db

import (
	"database/sql"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
)

type client struct {
	db *sql.DB
}

type Client interface {
	DB() *sql.DB
	CloseDB()
}

func ConnectMySQL() (client, error) {
	// MySQLに接続する
	// データベース接続部分
	dbconf := "finansu:password@tcp(nutfes-finansu-db:3306)/finansu_db?charset=utf8mb4&parseTime=true"
	db, err := sql.Open("mysql", dbconf)

	if err != nil {
		return client{}, err
	}

	err = db.Ping()

	if err != nil {
		fmt.Println("[Failed] Not Connect to MySQL") // 失敗
		return client{}, err
	} else {
		fmt.Println("[Success] Connect to MySQL") // 成功
		return client{db}, nil
	}
}

func (c client) CloseDB() {
	if c.db != nil {
		c.db.Close()
	}
}

func (c client) DB() *sql.DB {
	return c.db
}
