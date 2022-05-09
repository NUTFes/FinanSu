package db

import (
	"fmt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
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
	dns := "finansu:password@tcp(nutfes-finansu-db:3306)/finansu_db?charset=utf8mb4&parseTime=true"
	db, err := gorm.Open(mysql.Open(dns), &gorm.Config{})
	if err != nil {
		fmt.Println("[Failed] Not Connect to MySQL")
		return nil, err
	} else {
		fmt.Println("[Success] Connect to MySQL")
		return gormClient{db}, nil
	}
}
