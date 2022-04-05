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
	IndexPurchaseReport(echo.Context) error
	ShowPurchaseReport(echo.Context) error
	CreatePurchaseReport(echo.Context) error
	UpdatePurchaseReport(echo.Context) error
	DestroyPurchaseReport(echo.Context) error
	IndexPurchaseReportWithOrderItem(echo.Context) error
	ShowPurchaseReportWithOrderItem(echo.Context) error
}

func NewPurchaseReportController(u usecase.PurchaseReportUseCase) PurchaseReportController {
	return &purchaseReportController{u}
}

//Index
func (p *purchaseReportController) IndexPurchaseReport(c echo.Context)error{
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
	userID :=c.QueryParam("user_id")
	purchaseOrderID := c.QueryParam("purchase_order_id")
	
	err := p.u.CreatePurchaseReport(c.Request().Context(),userID, purchaseOrderID)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Create PurchaseReport")
}

//Update
func (p *purchaseReportController) UpdatePurchaseReport(c echo.Context) error{
	id := c.Param("id")
	userID :=c.QueryParam("user_id")
	purchaseOrderID := c.QueryParam("purchase_order_id")
	
	err := p.u.UpdatePurchaseReport(c.Request().Context(), id, userID, purchaseOrderID)
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

//IndexPurchaseReportWithOrderItem
func (p *purchaseReportController) IndexPurchaseReportWithOrderItem(c echo.Context) error{
	purchaseReportwithorderitems, err :=p.u.GetPurchaseReportsWithOrderItem(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, purchaseReportwithorderitems)
}

//ShowPurchaseReportWithOrderItem
func (p *purchaseReportController) ShowPurchaseReportWithOrderItem(c echo.Context) error {
	id := c.Param("id")
	purchaseReportwithorderitem, err := p.u.GetPurchaseReportWithOrderItemByID(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, purchaseReportwithorderitem)
}
