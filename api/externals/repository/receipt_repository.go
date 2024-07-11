package repository

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
	"github.com/NUTFes/FinanSu/api/internals/domain"
)

type receiptRepository struct {
	client db.Client
	crud   abstract.Crud
}

type ReceiptRepository interface {
	All(context.Context) (*sql.Rows, error)
	Find(context.Context, string) (*sql.Row, error)
	FindByPurchaseReportID(context.Context, string) (*sql.Rows, error)
	FindLatestRecord(context.Context) (*sql.Row, error)
	Create(context.Context, domain.Receipt) error
	Update(context.Context, string, domain.Receipt) error
	Destroy(context.Context, string) error
}

func NewReceiptRepository(c db.Client, ac abstract.Crud) ReceiptRepository {
	return &receiptRepository{c, ac}
}

// 全件取得
func (r *receiptRepository) All(c context.Context) (*sql.Rows, error) {
	query := "SELECT * FROM receipts"
	return r.crud.Read(c, query)
}

// 1件取得
func (r *receiptRepository) Find(c context.Context, id string) (*sql.Row, error) {
	query := "SELECT * FROM receipts WHERE id =" + id
	return r.crud.ReadByID(c, query)
}

// 購入報告IDに紐づいたレコードを全件取得
func (r *receiptRepository) FindByPurchaseReportID(c context.Context, purchaseReportID string) (*sql.Rows, error) {
	query := "SELECT * FROM receipts WHERE purchase_report_id =" + purchaseReportID
	return r.crud.Read(c, query)
}

// 最新のレコード1件取得
func (r *receiptRepository) FindLatestRecord(c context.Context) (*sql.Row, error) {
	query := "SELECT * FROM receipts ORDER BY id DESC LIMIT 1"
	return r.crud.ReadByID(c, query)
}

// 作成
func (r *receiptRepository) Create(c context.Context, receipt domain.Receipt) error {
	query := fmt.Sprintf(
		`INSERT INTO
			receipts (purchase_report_id, bucket_name, file_name, file_type, remark)
		VALUES
			(%d, "%s", "%s", "%s", "%s")`, receipt.PurchaseReportID, receipt.BucketName, receipt.FileName, receipt.FileType, receipt.Remark)
	return r.crud.UpdateDB(c, query)
}

// 編集
func (r *receiptRepository) Update(c context.Context, id string, receipt domain.Receipt) error {
	query := fmt.Sprintf(`
			UPDATE
				receipts
			SET
				purchase_report_id = %d,
				bucket_name = "%s",
				file_name = "%s",
				file_type = "%s",
				remark = "%s"
			WHERE
				id = %s`,receipt.PurchaseReportID, receipt.BucketName, receipt.FileName, receipt.FileType, receipt.Remark, id)
	return r.crud.UpdateDB(c, query)
}

// 削除
func (r *receiptRepository) Destroy(c context.Context, id string) error {
	query := "DELETE FROM receipts WHERE id =" + id
	return r.crud.UpdateDB(c, query)
}
