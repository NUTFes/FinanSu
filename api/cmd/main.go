package main

import (
	"fmt"
	"log"
	"reflect"

	"github.com/NUTFes/finansu/api/internal/di"
	_ "github.com/go-sql-driver/mysql"
)

func main() {

	// - echoのinstanceのpackage + DI
	s, err := di.InitializeServer()
	if err != nil {
		log.Fatalf("%v", err)
	}

	// データベースに接続
	db, err := di.InitializeDB()
	fmt.Println("================")
	fmt.Println(reflect.TypeOf(db))
	fmt.Println("================")
	client := db.GetClient()
	fmt.Println(reflect.TypeOf(client))
	fmt.Println("================")

	// サーバー起動
	s.Run()
}
