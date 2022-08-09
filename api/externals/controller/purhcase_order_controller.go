package controller

import(
	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/labstack/echo/v4"
	"net/http"
)

type purchaseOrderController struct {
	u usecase.PurchaseOrderUseCase
}

type PurchaseOrderController interface {
	IndexPurchaseOrder(echo.Context) error
	ShowPurchaseOrder(echo.Context) error
	CreatePurchaseOrder(echo.Context) error
	UpdatePurchaseOrder(echo.Context) error
	DestroyPurchaseOrder(echo.Context) error
	IndexOrderWithUserItem(echo.Context) error
	ShowOrderWithUserItem(echo.Context) error
	ShowNewPurchaseOrder(echo.Context) error
	ShowEditPurchaseOrder(echo.Context) error
}

func NewPurchaseOrderController(u usecase.PurchaseOrderUseCase) PurchaseOrderController {
	return &purchaseOrderController{u}
}

//Index
func (p *purchaseOrderController) IndexPurchaseOrder(c echo.Context) error{
	purchaseOrders , err :=p.u.GetPurchaseOrders(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, purchaseOrders)
}

//show
func (p *purchaseOrderController) ShowPurchaseOrder(c echo.Context) error{
	id :=c.Param("id")
	purchaseOrder, err := p.u.GetPurchaseOrderByID(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, purchaseOrder)
}

//Create
func (p *purchaseOrderController) CreatePurchaseOrder(c echo.Context) error{
	deadLine := c.QueryParam("deadline")
	userID := c.QueryParam("user_id")
	financeCheck := c.QueryParam("finance_check")
	err := p.u.CreatePurchaseOrder(c.Request().Context(), deadLine, userID, financeCheck)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Create PurchaseOrder")
}

//Update
func (p *purchaseOrderController) UpdatePurchaseOrder(c echo.Context) error{
	id := c.Param("id")
	deadLine := c.QueryParam("deadline")
	userID := c.QueryParam("user_id")
	financeCheck := c.QueryParam("finance_check")

	err := p.u.UpdatePurchaseOrder(c.Request().Context(), id, deadLine, userID, financeCheck)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Update PurchaseOrder")
}

//Destory
func (p *purchaseOrderController) DestroyPurchaseOrder(c echo.Context) error{
	id := c.Param("id")
	err := p.u.DestroyPurchaseOrder(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Destroy PurchaseOrder")
}

//IndexOrderWithUserItem
func (p *purchaseOrderController) IndexOrderWithUserItem(c echo.Context) error{
	orderWithUserItems, err := p.u.GetOrderWithUserItem(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK,orderWithUserItems)
}

func (p *purchaseOrderController) ShowOrderWithUserItem(c echo.Context) error{
	id := c.Param("id")
	orderWithUserAndItem , err := p.u.GetOrderWithUserItemByID(c.Request().Context(),id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK,orderWithUserAndItem)
}

//ShowNewPurchaseOrder
func (p *purchaseOrderController) ShowNewPurchaseOrder(c echo.Context) error{
	deadLine := c.QueryParam("deadline")
	userID := c.QueryParam("user_id")
	financeCheck := c.QueryParam("finance_check")
	purchaseOrder, err := p.u.GetPurchaseOrderNewRecord(c.Request().Context(),deadLine, userID, financeCheck)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, purchaseOrder)
}

//ShowEditPurchaseOrder
func (p *purchaseOrderController) ShowEditPurchaseOrder(c echo.Context) error{
	id := c.Param("id")
	deadLine := c.QueryParam("deadline")
	userID := c.QueryParam("user_id")
	financeCheck := c.QueryParam("finance_check")
	purchaseOrder,err :=p.u.GetPurchaseOrderEdit(c.Request().Context(), id, deadLine, userID, financeCheck)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, purchaseOrder)
}