package main

import (
  "net/http"
  "fmt"
  "database/sql"
  // "log"
  "time"
  "reflect"

  "github.com/labstack/echo/v4"
  "github.com/labstack/echo/v4/middleware"
  _ "github.com/go-sql-driver/mysql"

)
  
// Handler
func hello(c echo.Context) error {
  return c.String(http.StatusOK, "Hello, World!")
}

// func getBudgets(c echo.Context) error {
//   rows, err := db.Query("select * from budgets")
//   if err != nil {
//     log.Fatal(err)
//   }
//   defer rows.Close()
//
//   budget := Budget{}
//   // budgets := []*Budget{}
//
//   for rows.Next() {
//     err := rows.Scan(&budget.ID, &budget.Price, &budget.YearID, &budget.SourceID, &budget.CreatedAt, &budget.UpdatedAt)
//     if err != nil {
//       log.Fatal(err)
//     }
//     fmt.Println(reflect.TypeOf(budget))
//     // budgets = append(budgets, &Budget{ID: budget.ID, Price: budget.Price, YearID: budget.YearID, SourceID: budget.SourceID, CreatedAt: budget.CreatedAt, UpdatedAt: budget.UpdatedAt})
//   }
//   err = rows.Err()
//   if err != nil {
//     log.Fatal(err)
//   }
//   return c.JSON(http.StatusOK, budget)
// }

func getBudget(c echo.Context) error {
  id := c.Param("id")
  fmt.Println(id)
  return c.String(http.StatusOK, id)
}

type Budget struct {
  ID int `json:"id"`
  Price int `json:"id"`
  YearID int `json:"year_id"`
  SourceID int `json:"source_id"`
  CreatedAt time.Time `json:"created_at"`
  UpdatedAt time.Time `json:"updated_at"`
}

type Member struct {
  Id int `json:"id"`
  Name string `json:"name"`
}

func getMembers(c echo.Context) error {
  members := []Member{
    { Id: 1, Name: "test1" },
    { Id: 2, Name: "test2" },
  }
  return c.JSON(http.StatusOK, members)
}

func main() {
  // Echo instance
  e := echo.New()

  // Middleware
  e.Use(middleware.Logger())
  e.Use(middleware.Recover())


  // ### データベース接続の部分（後で別ファイルに移行） ###
  dbconf := "finansu:password@tcp(nutfes-finansu-db:3306)/finansu_db?charset=utf8mb4&parseTime=true"
  db, err := sql.Open("mysql", dbconf)
  fmt.Println(reflect.TypeOf(db))

  defer db.Close()

  if err != nil {
    fmt.Println(err.Error())
  }

  err = db.Ping()

  if err != nil {
    fmt.Println("データベース接続失敗")
    fmt.Println(err.Error())
  } else {
    fmt.Println("データベース接続成功")
  }
  

  // ######################################################

  // var c echo.HandlerFunc
  // Routes
  e.GET("/", hello)
  // e.GET("/budgets", c.JSON(http.StatusOK, budgets))
  e.GET("/budget/:id", getBudget)
  e.GET("/members", getMembers)

  // Start server
  e.Logger.Fatal(e.Start(":1323"))


}
