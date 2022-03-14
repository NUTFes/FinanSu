package controller

import(
	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/labstack/echo/v4"
	"net/http"
)

type purchaseReportController struct {
	u usecase.PurchaseReportUseCase
}

type PurchaseReportController interface {
	IndexPurcahseReport(echo.Context) error
	ShowPurchaseReport(echo.Context) error
	CreatePurchaseReport(echo.Context) error
	UpdatePurchaseReport(echo.Context) error
	DestroyPurchaseReport(echo.Context) error
}

func NewPurchaseReportController(u usecase.PurchaseReportUseCase) PurchaseReportController {
	return & purchaseReportController{u}
}

//Index
func (p *purchaseReportController) IndexPurcahseReport(c echo.Context)error{
	purchaseReports , err :=p.u.GetPurchaseReports(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, purchaseReports)
}

//show
func (p *purchaseReportController) ShowPurchaseReport(c echo.Context)error{
	id :=c.Param("id")
	purchaseReport , err :=p.u.GetPurchaseReportByID(c.Request().Context(), id)
	if err != nil{
		return err
	} 
	return c.JSON(http.StatusOK, purchaseReport)
}

//Create
func (p *purchaseReportController) CreatePurchaseReport(c echo.Context)error{
	item :=c.QueryParam("item")
	price :=c.QueryParam("price")
	userID :=c.QueryParam("user_id")
	purchaseOrderID := c.QueryParam("purchase_order_id")
	
	err := p.u.CreatePurchaseReport(c.Request().Context(),item, price, userID, purchaseOrderID)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Create PurchaseReport")
}

//Update
func (p *purchaseReportController) UpdatePurchaseReport(c echo.Context) error{
	id := c.Param("id")
	item :=c.QueryParam("item")
	price :=c.QueryParam("price")
	userID :=c.QueryParam("user_id")
	purchaseOrderID := c.QueryParam("purchase_order_id")
	
	err := p.u.UpdatePurchaseReport(c.Request().Context(), id, item, price, userID, purchaseOrderID)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Update PurchaseReport")
}

//Destory
func (p *purchaseReportController) DestroyPurchaseReport(c echo.Context) error{
	id := c.Param("id")
	err := p.u.DestroyPurchaseReport(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Destory PurchaseReport")
}