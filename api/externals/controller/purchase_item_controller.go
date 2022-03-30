package controller

import(
	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/labstack/echo/v4"
	"net/http"
)

type purchaseItemController struct {
	u usecase.PurchaseItemUseCase
}

type PurchaseItemController interface {
	IndexPurchaseItem(echo.Context) error
	ShowPurchaseItem(echo.Context) error
	CreatePurchaseItem(echo.Context) error
	UpdatePurchaseItem(echo.Context) error
	DestroyPurchaseItem(echo.Context) error
	IndexPurchaseItemWithPurchaseOrder(echo.Context) error
}

func NewPurchaseItemController(u usecase.PurchaseItemUseCase) PurchaseItemController{
	return &purchaseItemController{u}
}

//Index
func (p *purchaseItemController) IndexPurchaseItem(c echo.Context)error{
	purchaseItems , err := p.u.GetPurchaseItem(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, purchaseItems)
}

//show
func(p *purchaseItemController) ShowPurchaseItem(c echo.Context)error{
	id := c.Param("id")
	purchaseItem ,err := p.u.GetPurchaseItemByID(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK,purchaseItem)
}

//Create
func (p *purchaseItemController) CreatePurchaseItem(c echo.Context)error{
	item := c.QueryParam("item")
	price := c.QueryParam("price")
	quantity := c.QueryParam("quantity")
	detail := c.QueryParam("detail")
	url := c.QueryParam("url")
	purchaseOrderID := c.QueryParam("purchase_order_id")
	finansuCheck := c.QueryParam("finansu_check")

	err := p.u.CreatePurchaseItem(c.Request().Context(),item, price, quantity, detail, url, purchaseOrderID, finansuCheck)
	if err != nil {
		return err
	} 
	return c.String(http.StatusOK, "Create Purchaseitem")
}

//Update
func(p *purchaseItemController) UpdatePurchaseItem(c echo.Context)error{
	id := c.Param("id")
	item := c.QueryParam("item")
	price := c.QueryParam("price")
	quantity := c.QueryParam("quantity")
	detail := c.QueryParam("detail")
	url := c.QueryParam("url")
	purchaseOrderID := c.QueryParam("purchase_order_id")
	finansuCheck := c.QueryParam("finansu_check")

	err := p.u.UpdatePurchaseItem(c.Request().Context(), id, item, price, quantity, detail, url, purchaseOrderID,finansuCheck)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Update PurchaseItem")
}

//Destory
func (p *purchaseItemController) DestroyPurchaseItem(c echo.Context) error{
	id := c.Param("id")
	err := p.u.DestroyPurchaseItem(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.String(http.StatusOK, "Destory PurchaseItem")
}

//IndexPurchaseItemWithPurchaseOrder
func (p *purchaseItemController) IndexPurchaseItemWithPurchaseOrder(c echo.Context) error {
	purchaseItemWithPurchaseOrders, err := p.u.GetPurchaseItemWithPurchaseOrder(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, purchaseItemWithPurchaseOrders)
}