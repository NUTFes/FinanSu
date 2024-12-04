package main

import (
	"github.com/NUTFes/FinanSu/api/internals/di"
	_ "github.com/go-sql-driver/mysql"
)

func main() {
	client, echo := di.InitializeServer()
	echo.Start(":1323")
	defer client.CloseDB()
}
