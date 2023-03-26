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
	IndexPurchaseReportDetails(echo.Context) error
	ShowPurchaseReportDetail(echo.Context) error
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
	discount :=c.QueryParam("discount")
	addition :=c.QueryParam("addition")
	financeCheck :=c.QueryParam("finance_check") 
	purchaseOrderID := c.QueryParam("purchase_order_id")
	remark :=c.QueryParam("remark")
	latastPurchaseReport, err := p.u.CreatePurchaseReport(c.Request().Context(),userID, discount,addition,financeCheck,purchaseOrderID,remark)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, latastPurchaseReport)
}

//Update
func (p *purchaseReportController) UpdatePurchaseReport(c echo.Context) error{
	id := c.Param("id")
	userID :=c.QueryParam("user_id")
	discount :=c.QueryParam("discount")
	addition :=c.QueryParam("addition")
	financeCheck :=c.QueryParam("finance_check") 
	purchaseOrderID := c.QueryParam("purchase_order_id")
	remark :=c.QueryParam("remark")
	
	updatedPurchaseReport, err := p.u.UpdatePurchaseReport(c.Request().Context(), id, userID, discount, addition, financeCheck ,purchaseOrderID ,remark)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, updatedPurchaseReport)
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

func (p *purchaseReportController) IndexPurchaseReportDetails(c echo.Context) error{
	purchaseReportDetails, err :=p.u.GetPurchaseReportDetails(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, purchaseReportDetails)
}

func (p *purchaseReportController) ShowPurchaseReportDetail(c echo.Context) error {
	id := c.Param("id")
	purchaseReportDetail, err := p.u.GetPurchaseReportDetailByID(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, purchaseReportDetail)
}
