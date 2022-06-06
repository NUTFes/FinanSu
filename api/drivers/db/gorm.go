package db

import (
  "fmt"
  "gorm.io/driver/mysql"
  "gorm.io/gorm"
  "os"
)

type gormClient struct {
	db *gorm.DB
}

type GormClient interface {
	DB() *gorm.DB
}

func (c gormClient) DB() *gorm.DB {
	return c.db
}

func ConnectMySQLFromGorm() (GormClient, error) {
	dbUser := os.Getenv("NUTMEG_DB_USER")
	dbPassword := os.Getenv("NUTMEG_DB_PASSWORD")
	dbHost := os.Getenv("NUTMEG_DB_HOST")
	dbPort := os.Getenv("NUTMEG_DB_PORT")
	dbName := os.Getenv("NUTMEG_DB_NAME")
	dns := dbUser + ":" + dbPassword + "@tcp(" + dbHost + ":" + dbPort + ")/" + dbName + "?charset=utf8mb4&parseTime=true"
	db, err := gorm.Open(mysql.Open(dns), &gorm.Config{})
	if err != nil {
		fmt.Println("[Failed] Not Connect to MySQL")
		return nil, err
	} else {
		fmt.Println("[Success] Connect to MySQL")
		return gormClient{db}, nil
	}
}
