package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"time"
	_ "github.com/go-sql-driver/mysql"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/pkg/errors"
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

		for rows.Next() {
			err := rows.Scan(&budget.ID, 
				               &budget.Price, 
											 &budget.YearID, 
											 &budget.SourceID, 
											 &budget.CreatedAt, 
											 &budget.UpdatedAt)
			if err != nil {
				return errors.Wrapf(err, "cannot connect SQL")
			}
			budgets = append(budgets, budget)
		}
		return c.JSON(http.StatusOK, budgets)
	}
}

// Budgetの取得
func GetBudgetByID() echo.HandlerFunc {
	return func(c echo.Context) error {
		budget := Budget{}
		id := c.Param("id")
		err := DB.QueryRow("select * from budgets where id="+id).Scan(&budget.ID, &budget.Price, &budget.YearID, &budget.SourceID, &budget.CreatedAt, &budget.UpdatedAt)
		if err != nil {
			fmt.Println(err)
			return err
		}
		return c.JSON(http.StatusOK, budget)
	}
}

// Budgetの作成
func CreateBudget() echo.HandlerFunc {
	return func(c echo.Context) error {
		price := c.QueryParam("price")
		yearID := c.QueryParam("year_id")
		sourceID := c.QueryParam("source_id")
		_, err := DB.Exec("insert into budgets (price, year_id, source_id) values (" + price + "," + yearID + "," + sourceID + ")")
		if err != nil {
			return err
		}
		return c.String(http.StatusCreated, "Created Budget")
	}
}

// Budgetの修正
func UpdateBudget() echo.HandlerFunc {
	return func(c echo.Context) error {
		id := c.Param("id")
		price := c.QueryParam("price")
		yearID := c.QueryParam("year_id")
		sourceID := c.QueryParam("source_id")
		_, err := DB.Exec("update budgets set price = " + price + ", year_id = " + yearID + ", source_id = " + sourceID + " where id = " + string(id))
		if err != nil {
			return err
		}
		return c.String(http.StatusCreated, "Updated Budget")
	}
}

// Budgetの削除
func DestroyBudget() echo.HandlerFunc {
	return func(c echo.Context) error {
		id := c.Param("id")
		_, err := DB.Exec("delete from budgets where id = " + id)
		if err != nil {
			return err
		}
		return c.String(http.StatusCreated, "Destroy Budget")
	}
}

//PurchaseOrdersの取得
func GetPurchaseOrders() echo.HandlerFunc{
	return func(c echo.Context) error {
		parchaseorder := ParchaseOrder{}
		var parchaseorders []ParchaseOrder
		//クエリ実行
		rows,err := DB.Query("select* from purchase_orders")
		
		if err != nil {
			return errors.Wrapf(err,"can not connect SQL")
		}
		defer rows.Close()
		
		for rows.Next() {
			err :=rows.Scan(
				&parchaseorder.ID,
				&parchaseorder.Item,
				&parchaseorder.Price,
				&parchaseorder.DepartmentID, 
				&parchaseorder.Detail, 
				&parchaseorder.Url,
			  &parchaseorder.CreatedAt,
				&parchaseorder.UpdatedAt)
				if err != nil {
				return errors.Wrapf(err,"cannot connect SQL")
			}
			parchaseorders = append(parchaseorders, parchaseorder)
		}
		return c.JSON(http.StatusOK,parchaseorders)
	}
}

//value Object
type ID int
type Price int
type YearID int
type SourceID int

type Item string
type DepartmentID int
type Detail string
type Url string

type Budget struct {
	ID        ID        `json:"id"`
	Price     Price     `json:"price"`
	YearID    YearID    `json:"year_id"`
	SourceID  SourceID  `json:"source_id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type ParchaseOrder struct {
	ID           ID           `json:"id"`
	Item         Item         `json:"item"`
	Price        Price        `json:"price"`
	DepartmentID DepartmentID `json:"department_id"`
	Detail       Detail       `json:"detail"`
	Url          Url          `json:"url"`
	CreatedAt    time.Time    `json:"created_at"`
	UpdatedAt    time.Time    `json:"updated_at"`
}

func main() {
	// Echo instance
	e := echo.New()

	// データベースに接続
	connect()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// CORS対策
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000", "127.0.0.1:3000"}, // ドメイン
		AllowMethods: []string{http.MethodGet, http.MethodPut, http.MethodPost, http.MethodDelete},
	}))

	// Routes
	//budgetsのRoute
	e.GET("/", healthcheck)
	e.GET("/budgets", GetBudgets())
	e.GET("/budgets/:id", GetBudgetByID())
	e.POST("/budgets", CreateBudget())
	e.PUT("/budgets/:id", UpdateBudget())
	e.DELETE("/budgets/:id", DestroyBudget())
	//parcahseordersのRoute
	e.GET("/parchaseorders", GetPurchaseOrders())

	// Start server
	e.Logger.Fatal(e.Start(":1323"))
}
