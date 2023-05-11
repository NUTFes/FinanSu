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
	IndexPurchaseItemDetails(echo.Context) error
	ShowPurchaseItemDetails(echo.Context) error
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
	sourceID := c.QueryParam("source_id")
	detail := c.QueryParam("detail")
	url := c.QueryParam("url")
	purchaseOrderID := c.QueryParam("purchase_order_id")
	financeCheck := c.QueryParam("finance_check")
	latastPurchaseItem, err := p.u.CreatePurchaseItem(c.Request().Context(),item, price, quantity, sourceID, detail, url, purchaseOrderID, financeCheck)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, latastPurchaseItem)
}

//Update
func(p *purchaseItemController) UpdatePurchaseItem(c echo.Context)error{
	id := c.Param("id")
	item := c.QueryParam("item")
	price := c.QueryParam("price")
	quantity := c.QueryParam("quantity")
	sourceID := c.QueryParam("source_id")
	detail := c.QueryParam("detail")
	url := c.QueryParam("url")
	purchaseOrderID := c.QueryParam("purchase_order_id")
	financeCheck := c.QueryParam("finance_check")
	updatedPurchaseItem, err := p.u.UpdatePurchaseItem(c.Request().Context(), id, item, price, quantity, sourceID, detail, url, purchaseOrderID,financeCheck)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, updatedPurchaseItem)
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
func (p *purchaseItemController) IndexPurchaseItemDetails(c echo.Context) error {
	purchaseItemWithPurchaseOrders, err := p.u.GetPurchaseItemDetails(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, purchaseItemWithPurchaseOrders)
}

//ShowPurchaseItemWithPurchaseorder
func (p *purchaseItemController) ShowPurchaseItemDetails(c echo.Context) error {
	id :=c.Param("id")
	purchaseItemwithpurchaseorder, err :=p.u.GetPurchaseItemDetailsByID(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK,purchaseItemwithpurchaseorder )
}
