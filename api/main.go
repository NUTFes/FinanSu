package main

import (
	"time"

	"github.com/NUTFes/FinanSu/api/internals/di"
	_ "github.com/go-sql-driver/mysql"
)

func main() {
	// JSTに設定
	time.Local = time.FixedZone("JST", 9*60*60)

	serverComponents, err := di.InitializeServer()
	if err != nil {
		panic(err)
	}

	if err := serverComponents.Echo.Start(":1323"); err != nil {
		panic(err)
	}

	defer serverComponents.Client.CloseDB()
}
