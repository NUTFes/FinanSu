package main

import (
  "net/http"
  "fmt"
  "database/sql"
  "log"
  "time"

  "github.com/labstack/echo/v4"
  "github.com/labstack/echo/v4/middleware"
  "github.com/pkg/errors"
  _ "github.com/go-sql-driver/mysql"

)

var DB *sql.DB

func connect() {
  // データベース接続部分 
  dbconf := "finansu:password@tcp(nutfes-finansu-db:3306)/finansu_db?charset=utf8mb4&parseTime=true"
  var err error
  DB, err = sql.Open("mysql", dbconf)

  if err != nil {
    log.Println(err.Error())
  }

  err = DB.Ping()

  if err != nil {
    fmt.Println("[Failed] Not Connect to MySQL") // 失敗
    log.Println(err.Error())
  } else {
    fmt.Println("[Success] Connect to MySQL") // 成功
  }
}
  
// Handler
func healthcheck(c echo.Context) error {
  // 接続確認
  return c.String(http.StatusOK, "healthcheck: ok")
}

// Budgetsの取得
func GetBudgets() echo.HandlerFunc {
  return func(c echo.Context) error {

    budget := Budget{}
    var budgets []Budget

    // クエリー実行
    rows, err := DB.Query("select * from budgets")
    if err != nil {
      return errors.Wrapf(err, "cannot connect SQL")
    }
    defer rows.Close()

    for rows.Next(){
      err := rows.Scan(&budget.ID, &budget.Price, &budget.YearID, &budget.SourceID, &budget.CreatedAt, &budget.UpdatedAt)
      if err != nil{
        return errors.Wrapf(err, "cannot connect SQL")
      }
      budgets = append(budgets, budget)
    }
      return c.JSON(http.StatusOK, budgets)
  }
}


type Budget struct {
  ID int `json:"id"`
  Price int `json:"price"`
  YearID int `json:"year_id"`
  SourceID int `json:"source_id"`
  CreatedAt time.Time `json:"created_at"`
  UpdatedAt time.Time `json:"updated_at"`
}

func main() {
  // Echo instance
  e := echo.New()

  // データベースに接続
  connect()

  // Middleware
  e.Use(middleware.Logger())
  e.Use(middleware.Recover())

  // Routes
  e.GET("/", healthcheck)
  e.GET("/budgets", GetBudgets())

  // Start server
  e.Logger.Fatal(e.Start(":1323"))
}
