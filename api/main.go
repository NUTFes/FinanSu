package main

import (
	"github.com/NUTFes/FinanSu/api/internals/di"
	_ "github.com/go-sql-driver/mysql"
)

func main() {
	client := di.InitializeServer()
	defer client.CloseDB()
}
