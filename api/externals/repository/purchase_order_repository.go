package repository

import (
	"context"
	"database/sql"
	"fmt"
	"os"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/slack-go/slack"
)

type purchaseOrderRepository struct {
	client db.Client
	crud   abstract.Crud
}

type PurchaseOrderRepository interface {
	All(context.Context) (*sql.Rows, error)
	Find(context.Context, string) (*sql.Row, error)
	Create(context.Context, string, string, string, string) error
	Update(context.Context, string, string, string, string, string) error
	Delete(context.Context, string) error
	AllUserInfo(context.Context) (*sql.Rows, error)
	FindUserInfo(context.Context, string) (*sql.Row, error)
	FindPurchaseItem(context.Context, string) (*sql.Rows, error)
	FindNewRecord(context.Context) (*sql.Row, error)
	DeleteItems(context.Context, string) error
	DeleteReport(context.Context, string) error
	AllUserInfoByYear(context.Context, string) (*sql.Rows, error)
	NotifySlack(context.Context, domain.PurchaseOrder, []domain.PurchaseItem, domain.User, domain.Bureau, domain.Expense) error
	AllUnregisteredUserInfoByYear(context.Context, string) (*sql.Rows, error)
}

func NewPurchaseOrderRepository(c db.Client, ac abstract.Crud) PurchaseOrderRepository {
	return &purchaseOrderRepository{c, ac}
}

// 全件取得
func (por *purchaseOrderRepository) All(c context.Context) (*sql.Rows, error) {
	query := "SELECT * FROM purchase_orders"
	return por.crud.Read(c, query)
}

// 1件取得
func (por *purchaseOrderRepository) Find(c context.Context, id string) (*sql.Row, error) {
	query := "SELECT * FROM purchase_orders WHERE id = " + id
	return por.crud.ReadByID(c, query)
}

// 作成
func (por *purchaseOrderRepository) Create(
	c context.Context,
	deadLine string,
	userId string,
	expenseId string,
	financeCheck string,
) error {
	query := `
		INSERT INTO
			purchase_orders (deadline, user_id, expense_id, finance_check)
		VALUES ('` + deadLine + "'," + userId + "," + expenseId + "," +financeCheck + ")"
	return por.crud.UpdateDB(c, query)
}

// 編集
func (por *purchaseOrderRepository) Update(
	c context.Context,
	id string,
	deadLine string,
	userId string,
	expenseId string,
	financeCheck string,
) error {
	query := `
		UPDATE
			purchase_orders
		SET
			deadline ='` + deadLine +
		"', user_id = " + userId +
		", expense_id = " + expenseId +
		", finance_check = " + financeCheck +
		" WHERE id = " + id
	return por.crud.UpdateDB(c, query)
}

// 削除
func (por *purchaseOrderRepository) Delete(
	c context.Context,
	id string,
) error {
	query := `DELETE FROM purchase_orders WHERE id =` + id
	return por.crud.UpdateDB(c, query)
}

// orderに紐づくuserの取得(All)
func (p *purchaseOrderRepository) AllUserInfo(c context.Context) (*sql.Rows, error) {
	query := `
		SELECT
			*
		FROM
			purchase_orders
		INNER JOIN
			users
		ON
			purchase_orders.user_id = users.id;`
	return p.crud.Read(c, query)
}

// orderに紐づくuserの取得(byID)
func (p *purchaseOrderRepository) FindUserInfo(c context.Context, id string) (*sql.Row, error) {
	query := `
		SELECT
			*
		FROM
			purchase_orders
		INNER JOIN
			users
		ON
			purchase_orders.user_id = users.id
		WHERE
			purchase_orders.id =` + id
	return p.crud.ReadByID(c, query)
}

// 指定したorder_idのitemを取得する
func (p *purchaseOrderRepository) FindPurchaseItem(c context.Context, purchaseOrderID string) (*sql.Rows, error) {
	query := `
		SELECT
			*
		FROM
			purchase_items
		WHERE
			purchase_items.purchase_order_id =` + purchaseOrderID
	return p.crud.Read(c, query)
}

// 最新のレコードを取得
func (por *purchaseOrderRepository) FindNewRecord(c context.Context) (*sql.Row, error) {
	query := `
		SELECT
			*
		FROM
			purchase_orders
		ORDER BY
			id
		DESC LIMIT 1`
	return por.crud.ReadByID(c, query)
}

// 紐づいたitemの削除
func (por *purchaseOrderRepository) DeleteItems(
	c context.Context,
	id string,
) error {
	query := `DELETE FROM purchase_items WHERE purchase_order_id =` + id
	return por.crud.UpdateDB(c, query)
}

// 紐づいたreportの削除
func (por *purchaseOrderRepository) DeleteReport(
	c context.Context,
	id string,
) error {
	query := `DELETE FROM purchase_reports WHERE purchase_order_id =` + id
	return por.crud.UpdateDB(c, query)
}

func (p *purchaseOrderRepository) AllUserInfoByYear(c context.Context, year string) (*sql.Rows, error) {
	query := `
		SELECT
			purchase_orders.*,
			users.*
		FROM
			purchase_orders
		INNER JOIN
			users
		ON
			purchase_orders.user_id = users.id
		INNER JOIN
			year_periods
		ON
			purchase_orders.created_at > year_periods.started_at
		AND
			purchase_orders.created_at < year_periods.ended_at
		INNER JOIN
			years
		ON
			year_periods.year_id = years.id
		WHERE
			years.year = ` + year +
		" ORDER BY purchase_orders.id"
	return p.crud.Read(c, query)
}

func (p *purchaseOrderRepository) NotifySlack(c context.Context, purchaseOrder domain.PurchaseOrder, purchaseItems []domain.PurchaseItem, user domain.User, bureau domain.Bureau, expense domain.Expense) error {
		token := os.Getenv("BOT_USER_OAUTH_TOKEN")
		channelName := os.Getenv("CHANNEL_NAME")

		//メッセージ作成
		sendMessage := "購入申請を受け付けました \n"
		sendMessage += fmt.Sprintf("局・団体： %s", expense.Name) + " \n"
		sendMessage += fmt.Sprintf("申請者： %s  %s", bureau.Name, user.Name) + " \n"
		sendMessage += "購入物品 \n"
		//合計金額
		sum := 0
		//購入物品
		for _, item := range purchaseItems{
			sum += item.Price*item.Quantity
			sendMessage += fmt.Sprintf("・%s  %d円  %d個", item.Item, item.Price, item.Quantity) + " \n"
		}
		sendMessage += fmt.Sprintf("合計  %d円", sum)
		client := slack.New(token)

		_, _, err := client.PostMessage(channelName, slack.MsgOptionText(sendMessage, false))
		if err != nil {
			panic(err)
		}
		return err
}

func (p *purchaseOrderRepository) AllUnregisteredUserInfoByYear(c context.Context, year string) (*sql.Rows, error) {
	query := `
		SELECT
			orders.*,
			users.*
		FROM
			purchase_orders AS orders
		INNER JOIN
			users
		ON
			orders.user_id = users.id
		INNER JOIN
			year_periods AS yp
		ON
			orders.created_at > yp.started_at
		AND
			orders.created_at < yp.ended_at
		INNER JOIN
			years
		ON
			yp.year_id = years.id
		LEFT OUTER JOIN
			purchase_reports AS reports
		ON
			orders.id = reports.purchase_order_id
		WHERE
			years.year = `+ year +`
		AND
			reports.purchase_order_id IS NULL
		ORDER BY
			orders.id`
	return p.crud.Read(c, query)
}
