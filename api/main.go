package main

import (
	"time"

	"github.com/NUTFes/FinanSu/api/internals/di"
	_ "github.com/go-sql-driver/mysql"
)

func main() {
	// JSTに設定
	time.Local = time.FixedZone("JST", 9*60*60)

	client, echo := di.InitializeServer()

	if err := echo.Start(":1323"); err != nil {
		panic(err)
	}

	defer client.CloseDB()
}
