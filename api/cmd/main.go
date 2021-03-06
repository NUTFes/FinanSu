package main

import (
	"github.com/NUTFes/FinanSu/api/internals/di"
	_ "github.com/go-sql-driver/mysql"
)

////PurchaseOrdersの取得
//func GetPurchaseOrders() echo.HandlerFunc {
//	return func(c echo.Context) error {
//		purchaseorder := PurchaseOrder{}
//		var purchaseorders []PurchaseOrder
//		//クエリ実行
//		rows, err := DB.Query("select* from purchase_orders")
//
//		if err != nil {
//			return errors.Wrapf(err, "can not connect SQL")
//		}
//		defer rows.Close()
//
//		for rows.Next() {
//			err := rows.Scan(
//				&purchaseorder.ID,
//				&purchaseorder.Item,
//				&purchaseorder.Price,
//				&purchaseorder.DepartmentID,
//				&purchaseorder.Detail,
//				&purchaseorder.Url,
//				&purchaseorder.CreatedAt,
//				&purchaseorder.UpdatedAt)
//			if err != nil {
//				return errors.Wrapf(err, "cannot connect SQL")
//			}
//			purchaseorders = append(purchaseorders, purchaseorder)
//		}
//		return c.JSON(http.StatusOK, purchaseorders)
//	}
//}
//
////PurchaseOrderの取得(Get)
//func GetPurchaseOrder() echo.HandlerFunc {
//	return func(c echo.Context) error {
//		purchaseorder := PurchaseOrder{}
//		id := c.Param("id")
//		err := DB.QueryRow("select * from purchase_orders where id = "+id).Scan(
//			&purchaseorder.ID,
//			&purchaseorder.Item,
//			&purchaseorder.Price,
//			&purchaseorder.DepartmentID,
//			&purchaseorder.Detail,
//			&purchaseorder.Url,
//			&purchaseorder.CreatedAt,
//			&purchaseorder.UpdatedAt,
//		)
//		if err != nil {
//			fmt.Println(err)
//			return err
//		}
//		return c.JSON(http.StatusOK, purchaseorder)
//	}
//}
//
////PurchaseOrderの作成(Create)
//func CreatePurchaseOrder() echo.HandlerFunc {
//	return func(c echo.Context) error {
//		item := c.QueryParam("item")
//		price := c.QueryParam("price")
//		departmentID := c.QueryParam("department_id")
//		detail := c.QueryParam("detail")
//		url := c.QueryParam("url")
//		_, err := DB.Exec("insert into purchase_orders (item, price, department_id, detail, url) values (" + item + "," + price + "," + departmentID + "," + detail + "," + url + ")")
//		if err != nil {
//			return err
//		}
//		return c.String(http.StatusCreated, "Created PurchaseOrders")
//	}
//}
//
////PurchaseOrderの修正(Update)
//func UpdatePurchaseOrder() echo.HandlerFunc {
//	return func(c echo.Context) error {
//		id := c.Param("id")
//		item := c.QueryParam("item")
//		price := c.QueryParam("price")
//		departmentID := c.QueryParam("department_id")
//		detail := c.QueryParam("detail")
//		url := c.QueryParam("url")
//		_, err := DB.Exec("update purchase_orders set item = " + item + ", price = " + price + ", department_id = " + departmentID + " , detail = " + detail + " , url = " + url + " where id = " + string(id))
//		if err != nil {
//			return err
//		}
//		return c.String(http.StatusCreated, "Update PurchaseOrder")
//	}
//}
//
////PurchaseOrderの消去(Delete)
//func DeletePurchaseOrder() echo.HandlerFunc {
//	return func(c echo.Context) error {
//		id := c.Param("id")
//		_, err := DB.Exec("delete from purchase_orders where id = " + id)
//		if err != nil {
//			return err
//		}
//		return c.String(http.StatusOK, "Delete PurchaseOrder")
//	}
//}
//
////PurchaseReportsの取得(Get)
//func GetPurchaseReports() echo.HandlerFunc {
//	return func(c echo.Context) error {
//		purchasereport := PurchaseReport{}
//		var purchasereports []PurchaseReport
//
//		rows, err := DB.Query("select * from purchase_reports")
//		if err != nil {
//			return errors.Wrapf(err, "can not connect SQL")
//		}
//		defer rows.Close()
//
//		for rows.Next() {
//			err := rows.Scan(
//				&purchasereport.ID,
//				&purchasereport.Item,
//				&purchasereport.Price,
//				&purchasereport.DepartmentID,
//				&purchasereport.PurchaseOrderID,
//				&purchasereport.CreatedAt,
//				&purchasereport.UpdatedAt,
//			)
//			if err != nil {
//				return errors.Wrapf(err, "can not connect SQL")
//			}
//			purchasereports = append(purchasereports, purchasereport)
//		}
//		return c.JSON(http.StatusOK, purchasereports)
//	}
//}
//
////PurchaseReportの取得(Get)
//func GetPurchaseReport() echo.HandlerFunc {
//	return func(c echo.Context) error {
//		purchasereport := PurchaseReport{}
//		id := c.Param("id")
//		err := DB.QueryRow("select * from purchase_reports where id ="+id).Scan(
//			&purchasereport.ID,
//			&purchasereport.Item,
//			&purchasereport.Price,
//			&purchasereport.DepartmentID,
//			&purchasereport.PurchaseOrderID,
//			&purchasereport.CreatedAt,
//			&purchasereport.UpdatedAt,
//		)
//		if err != nil {
//			fmt.Println("error")
//			return err
//		}
//		return c.JSON(http.StatusOK, purchasereport)
//	}
//}
//
////PurchaseReportの作成(Create)
//func CreatePurchaseReport() echo.HandlerFunc {
//	return func(c echo.Context) error {
//		item := c.QueryParam("item")
//		price := c.QueryParam("price")
//		DepartmentID := c.QueryParam("department_id")
//		PurchaseOrderID := c.QueryParam("purchase_order_id")
//		_, err := DB.Exec("insert into purchase_reports (item, price, department_id, purchase_order_id ) values (" + item + "," + price + "," + DepartmentID + "," + PurchaseOrderID + ")")
//		if err != nil {
//			return err
//		}
//		return c.String(http.StatusCreated, "Create PurchaseReport")
//	}
//}
//
////PurchaseReportの修正(Update)
//func UpdatePurchaseReport() echo.HandlerFunc {
//	return func(c echo.Context) error {
//		id := c.Param("id")
//		item := c.QueryParam("item")
//		price := c.QueryParam("price")
//		DepartmentID := c.QueryParam("department_id")
//		PurchaseOrderID := c.QueryParam("purchase_order_id")
//		_, err := DB.Exec("update purchase_reports set item =" + item + ", price = " + price + " , department_id = " + DepartmentID + ", purchase_order_id = " + PurchaseOrderID + " where id = " + string(id))
//		if err != nil {
//			return err
//		}
//		return c.String(http.StatusCreated, "Update PurchaseReport")
//	}
//}
//
////PurchaseReportの削除(delete)
//func DeletePurchaseReport() echo.HandlerFunc {
//	return func(c echo.Context) error {
//		id := c.Param("id")
//		_, err := DB.Exec("delete from purchase_reports where id =" + id)
//		if err != nil {
//			return err
//		}
//		return c.String(http.StatusCreated, "Delete PurchaseReport")
//	}
//}
//
//// PurchaseOrder構造体定義
//type PurchaseOrder struct {
//	ID           ID           `json:"id"`
//	Item         Item         `json:"item"`
//	Price        Price        `json:"price"`
//	DepartmentID DepartmentID `json:"department_id"`
//	Detail       Detail       `json:"detail"`
//	Url          Url          `json:"url"`
//	CreatedAt    time.Time    `json:"created_at"`
//	UpdatedAt    time.Time    `json:"updated_at"`
//}
//
//// PurchaseRepoer構造体定義
//type PurchaseReport struct {
//	ID              ID              `json:"id"`
//	Item            Item            `json:"item"`
//	Price           Price           `json:"price"`
//	DepartmentID    DepartmentID    `json:"department_id"`
//	PurchaseOrderID PurchaseOrderID `json:"purchase_order_id"`
//	CreatedAt       time.Time       `json:"created_at"`
//	UpdatedAt       time.Time       `json:"updated_at"`
//}

func main() {
	client := di.InitializeServer()
	defer client.CloseDB()
}
