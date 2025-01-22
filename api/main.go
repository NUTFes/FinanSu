package main

import (
	"time"

	"github.com/NUTFes/FinanSu/api/internals/di"
	_ "github.com/go-sql-driver/mysql"
)

func main() {
	// JSTに設定
	time.Local = time.FixedZone("JST", 9*60*60)
	time.LoadLocation("JST")

	client, echo := di.InitializeServer()
	echo.Start(":1323")
	defer client.CloseDB()
}
