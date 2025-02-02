package repository

import (
	"context"
	"database/sql"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
	"github.com/NUTFes/FinanSu/api/generated"
	goqu "github.com/doug-martin/goqu/v9"
)

type buyReportRepository struct {
	client db.Client
	crud   abstract.Crud
}

type BuyReportRepository interface {
	CreateBuyReport(context.Context, *sql.Tx, PostBuyReport) (int64, error)
	InitBuyStatus(context.Context, *sql.Tx) error
	CreatePaymentReceipt(context.Context, *sql.Tx, FileInfo) error
}

func NewBuyReportRepository(c db.Client, ac abstract.Crud) BuyReportRepository {
	return &buyReportRepository{c, ac}
}

// buyReport作成
func (brr *buyReportRepository) CreateBuyReport(
	c context.Context,
	tx *sql.Tx,
	buyReportInfo PostBuyReport,
) (int64, error) {
	var id int64
	ds := dialect.Insert("buy_reports").
		Rows(goqu.Record{"festival_item_id": buyReportInfo.FestivalItemID, "amount": buyReportInfo.Amount, "memo": "", "paid_by": buyReportInfo.PaidBy})
	query, _, err := ds.ToSQL()
	if err != nil {
		return id, err
	}
	err = brr.crud.TransactionExec(c, tx, query)
	if err != nil {
		return id, err
	}
	// last_insert_idを,mysqlの変数に格納
	setQuery := "SET @new_buy_report_id = last_insert_id();"
	err = brr.crud.TransactionExec(c, tx, setQuery)
	if err != nil {
		return id, err
	}
	row, err := brr.crud.TransactionReadByID(c, tx, "SELECT @new_buy_report_id")
	if err != nil {
		return id, err
	}
	err = row.Scan(&id)
	return id, err
}

// buyReportのステータスを初期化
func (brr *buyReportRepository) InitBuyStatus(
	c context.Context,
	tx *sql.Tx,
) error {
	ds := dialect.Insert("buy_statuses").
		Rows(goqu.Record{"buy_report_id": goqu.L("@new_buy_report_id"), "is_packed": 0, "is_settled": 0})

	query, _, err := ds.ToSQL()
	if err != nil {
		return err
	}
	err = brr.crud.TransactionExec(c, tx, query)
	return err
}

// payment_receipt作成
func (brr *buyReportRepository) CreatePaymentReceipt(
	c context.Context,
	tx *sql.Tx,
	fileInfo FileInfo,
) error {
	ds := dialect.Insert("payment_receipts").
		Rows(goqu.Record{"buy_report_id": goqu.L("@new_buy_report_id"), "bucket_name": BUCKET_NAME, "file_name": fileInfo.FileName, "file_type": fileInfo.FileType, "remark": ""})
	query, _, err := ds.ToSQL()
	if err != nil {
		return err
	}
	err = brr.crud.TransactionExec(c, tx, query)
	return err
}

type PostBuyReport = generated.BuyReport
