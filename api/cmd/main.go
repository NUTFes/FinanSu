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
		purchaseorder := PurchaseOrder{}
		var purchaseorders []PurchaseOrder
		//クエリ実行
		rows,err := DB.Query("select* from purchase_orders")
		
		if err != nil {
			return errors.Wrapf(err,"can not connect SQL")
		}
		defer rows.Close()
		
		for rows.Next() {
			err :=rows.Scan(
				&purchaseorder.ID,
				&purchaseorder.Item,
				&purchaseorder.Price,
				&purchaseorder.DepartmentID, 
				&purchaseorder.Detail, 
				&purchaseorder.Url,
			  &purchaseorder.CreatedAt,
				&purchaseorder.UpdatedAt)
				if err != nil {
				return errors.Wrapf(err,"cannot connect SQL")
			}
			purchaseorders = append(purchaseorders, purchaseorder)
		}
		return c.JSON(http.StatusOK,purchaseorders)
	}
}

//PurchaseOrderの取得(Get)
func GetPurchaseOrder() echo.HandlerFunc {
	return func(c echo.Context) error {
		purchaseorder := PurchaseOrder{}
		id := c.Param("id")
		err := DB.QueryRow("select * from purchase_orders where id = "+id).Scan(
			&purchaseorder.ID,
			&purchaseorder.Item,
			&purchaseorder.Price,
			&purchaseorder.DepartmentID,
			&purchaseorder.Detail,
			&purchaseorder.Url,
			&purchaseorder.CreatedAt,
			&purchaseorder.UpdatedAt,
		)
		if err != nil {
			fmt.Println(err)
			return err
		}
		return c.JSON(http.StatusOK, purchaseorder)
	}
}

//PurchaseOrderの作成(Create)
func CreatePurchaseOrder() echo.HandlerFunc{
	return func (c echo.Context) error {
		item := c.QueryParam("item")
		price := c.QueryParam("price")
		departmentID := c.QueryParam("department_id")
		detail := c.QueryParam("detail")
		url := c.QueryParam("url")
		_, err := DB.Exec("insert into purchase_orders (item, price, department_id, detail, url) values ("+ item + "," + price + "," + departmentID + "," + detail + "," + url + ")")
		if err != nil {
			return err
		}
		return c.String(http.StatusCreated, "Created PurchaseOrders")
	}
}

//PurchaseOrderの修正(Update)
func UpdatePurchaseOrder() echo.HandlerFunc{
	return func (c echo.Context) error {
		id := c.Param("id")
		item := c.QueryParam("item")
		price := c.QueryParam("price")
		departmentID := c.QueryParam("department_id")
		detail := c.QueryParam("detail")
		url := c.QueryParam("url")
		_, err := DB.Exec("update purchase_orders set item = " + item + ", price = " + price + ", department_id = " + departmentID + " , detail = " + detail + " , url = " + url + " where id = " + string(id))
		if err != nil {
			return err
		}
		return c.String(http.StatusCreated, "Update PurchaseOrder")
	}
}

//PurchaseOrderの消去(Delete)
func DeletePurchaseOrder() echo.HandlerFunc{
	return func (c echo.Context) error {
		id := c.Param("id")
		_, err := DB.Exec("delete from purchase_orders where id = " + id)
		if err != nil{
			return err
		}
		return c.String(http.StatusOK, "Delete PurchaseOrder")
	}
}

//PurchaseReportsの取得(Get)
func GetPurchaseReports() echo.HandlerFunc{
	return func (c echo.Context) error {
		purchasereport := PurchaseReport{}
		var purchasereports []PurchaseReport

		rows ,err := DB.Query("select * from purchase_reports")
		if err != nil {
			return errors.Wrapf(err , "can not connect SQL")
		}
		defer rows.Close()

		for rows.Next(){
			err := rows.Scan(
				&purchasereport.ID,
				&purchasereport.Item,
				&purchasereport.Price,
				&purchasereport.DepartmentID,
				&purchasereport.PurchaseOrderID,
				&purchasereport.CreatedAt,
				&purchasereport.UpdatedAt,
			)
			if err != nil {
				return errors.Wrapf(err , "can not connect SQL")
			}
			purchasereports = append(purchasereports,purchasereport)
		}
		return c.JSON(http.StatusOK,purchasereports)
	}
}
//PurchaseReportの取得(Get)
func GetPurchaseReport() echo.HandlerFunc{
	return func (c echo.Context) error{
		purchasereport := PurchaseReport{}
		id := c.Param("id")
		err := DB.QueryRow("select * from purchase_reports where id =" + id).Scan(
			&purchasereport.ID,
			&purchasereport.Item,
			&purchasereport.Price,
			&purchasereport.DepartmentID,
			&purchasereport.PurchaseOrderID,
			&purchasereport.CreatedAt,
			&purchasereport.UpdatedAt,
		)
		if err != nil {
			fmt.Println("error")
			return err
		}
		return c.JSON(http.StatusOK , purchasereport)
	}
}
//PurchaseReportの作成(Create)
func CreatePurchaseReport() echo.HandlerFunc{
	return func (c echo.Context) error {
		item := c.QueryParam("item")
		price := c.QueryParam("price")
		DepartmentID := c.QueryParam("department_id")
		PurchaseOrderID := c.QueryParam("purchase_order_id")
		_, err := DB.Exec("insert into purchase_reports (item, price, department_id, purchase_order_id ) values ("+ item + "," + price + "," + DepartmentID + "," + PurchaseOrderID + ")" )
		if err != nil {
			return err
		}
		return c.String(http.StatusCreated,"Create PurchaseReport")
  }
}
//PurchaseReportの修正(Update)
func UpdatePurchaseReport() echo.HandlerFunc{
	return func(c echo.Context) error {
		id := c.Param("id")
		item := c.QueryParam("item")
		price := c.QueryParam("price")
		DepartmentID := c.QueryParam("department_id")
		PurchaseOrderID := c.QueryParam("purchase_order_id")
		_, err := DB.Exec("update purchase_reports set item =" + item + ", price = " + price + " , department_id = " + DepartmentID + ", purchase_order_id = " + PurchaseOrderID + " where id = " + string(id))
		if err != nil {
			return err
		}
		return c.String(http.StatusCreated,"Update PurchaseReport")
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

type PurchaseOrderID int

//Budget構造体定義
type Budget struct {
	ID        ID        `json:"id"`
	Price     Price     `json:"price"`
	YearID    YearID    `json:"year_id"`
	SourceID  SourceID  `json:"source_id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// PurchaseOrder構造体定義
type PurchaseOrder struct {
	ID           ID           `json:"id"`
	Item         Item         `json:"item"`
	Price        Price        `json:"price"`
	DepartmentID DepartmentID `json:"department_id"`
	Detail       Detail       `json:"detail"`
	Url          Url          `json:"url"`
	CreatedAt    time.Time    `json:"created_at"`
	UpdatedAt    time.Time    `json:"updated_at"`
}

// PurchaseRepoer構造体定義
type PurchaseReport struct {
	ID              ID                 `json:"id"`
	Item            Item               `json:"item"`
	Price           Price              `json:"price"`
	DepartmentID    DepartmentID       `json:"department_id"`
  PurchaseOrderID PurchaseOrderID    `json:"purchase_order_id"`
	CreatedAt       time.Time          `json:"created_at"`
	UpdatedAt       time.Time          `json:"updated_at"`
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
	e.GET("/purchaseorders", GetPurchaseOrders())
	e.GET("/purchaseorders/:id", GetPurchaseOrder())
	e.POST("/purchaseorders", CreatePurchaseOrder())
	e.PUT("/purchaseorders/:id" , UpdatePurchaseOrder())
	e.DELETE("/purchaseorders/:id" , DeletePurchaseOrder())
	//purchasereportsのRoute
	e.GET("/purchasereports", GetPurchaseReports())
	e.GET("/purchasereports/:id", GetPurchaseReport())
	e.POST("/purchasereports" , CreatePurchaseReport())
	e.PUT("/purchasereports/:id", UpdatePurchaseReport())
	
	// Start server
	e.Logger.Fatal(e.Start(":1323"))
}
