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
	UpdateBuyReport(context.Context, *sql.Tx, string, PostBuyReport) error
	InitBuyStatus(context.Context, *sql.Tx) error
	CreatePaymentReceipt(context.Context, *sql.Tx, FileInfo) error
	UpdatePaymentReceipt(context.Context, *sql.Tx, string, FileInfo) error
	GetPaymentReceipt(context.Context, *sql.Tx, string) (*sql.Row, error)
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

// buyReport作成
func (brr *buyReportRepository) UpdateBuyReport(
	c context.Context,
	tx *sql.Tx,
	id string,
	buyReportInfo PostBuyReport,
) error {
	ds := dialect.Update("buy_reports").
		Set(goqu.Record{"festival_item_id": buyReportInfo.FestivalItemID, "amount": buyReportInfo.Amount, "memo": "", "paid_by": buyReportInfo.PaidBy}).
		Where(goqu.Ex{"id": id})

	query, _, err := ds.ToSQL()
	if err != nil {
		return err
	}
	err = brr.crud.TransactionExec(c, tx, query)
	return err
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

// payment_receipt更新
func (brr *buyReportRepository) UpdatePaymentReceipt(
	c context.Context,
	tx *sql.Tx,
	id string,
	fileInfo FileInfo,
) error {
	ds := dialect.Update("payment_receipts").
		Set(goqu.Record{"bucket_name": BUCKET_NAME, "file_name": fileInfo.FileName, "file_type": fileInfo.FileType, "remark": ""}).
		Where(goqu.Ex{"buy_report_id": id})
	query, _, err := ds.ToSQL()
	if err != nil {
		return err
	}
	err = brr.crud.TransactionExec(c, tx, query)
	return err
}

// payment_receipt取得
func (brr *buyReportRepository) GetPaymentReceipt(
	c context.Context,
	tx *sql.Tx,
	id string,
) (*sql.Row, error) {
	query, _, err := dialect.From("payment_receipts").Select("payment_receipts.*", "years.year").
		InnerJoin(goqu.I("buy_reports"), goqu.On(goqu.I("buy_reports.id").Eq(goqu.I("payment_receipts.buy_report_id")))).
		InnerJoin(goqu.I("festival_items"), goqu.On(goqu.I("festival_items.id").Eq(goqu.I("buy_reports.festival_item_id")))).
		InnerJoin(goqu.I("divisions"), goqu.On(goqu.I("divisions.id").Eq(goqu.I("festival_items.division_id")))).
		InnerJoin(goqu.I("financial_records"), goqu.On(goqu.I("financial_records.id").Eq(goqu.I("divisions.financial_record_id")))).
		InnerJoin(goqu.I("years"), goqu.On(goqu.I("years.id").Eq(goqu.I("financial_records.year_id")))).
		Where(goqu.Ex{"buy_report_id": id}).ToSQL()
	if err != nil {
		return nil, err
	}
	return brr.crud.TransactionReadByID(c, tx, query)
}

type PostBuyReport = generated.BuyReport
