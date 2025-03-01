package usecase

import (
	"context"
	"mime/multipart"
	"strconv"
	"strings"
	"time"

	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/generated"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/pkg/errors"
)

type buyReportUseCase struct {
	bRep rep.BuyReportRepository
	tRep rep.TransactionRepository
	oRep rep.ObjectHandleRepository
}

type BuyReportUseCase interface {
	CreateBuyReport(context.Context, PostBuyReport, *multipart.FileHeader) (PostBuyReport, error)
	UpdateBuyReport(context.Context, string, PostBuyReport, *multipart.FileHeader) (PostBuyReport, error)
	DeleteBuyReport(context.Context, string) error
	GetBuyReports(context.Context, string) ([]BuyReportDetail, error)
	UpdateBuyReportStatus(context.Context, string, PutBuyReport) (BuyReportDetail, error)
}

func NewBuyReportUseCase(bRep rep.BuyReportRepository, tRep rep.TransactionRepository, oRep rep.ObjectHandleRepository) BuyReportUseCase {
	return &buyReportUseCase{bRep, tRep, oRep}
}

func (bru *buyReportUseCase) CreateBuyReport(c context.Context, buyReportInfo PostBuyReport, file *multipart.FileHeader) (PostBuyReport, error) {
	var resBuyReport PostBuyReport
	// トランザクションスタート
	tx, _ := bru.tRep.StartTransaction(c)

	// buy_report の作成
	buyReportId, err := bru.bRep.CreateBuyReport(c, tx, buyReportInfo)
	intBuyReportId := int(buyReportId)
	buyReportInfo.Id = &intBuyReportId
	if err != nil {
		bru.tRep.RollBack(c, tx)
		return buyReportInfo, err
	}

	// buy_statusの初期レコード作成
	err = bru.bRep.InitBuyStatus(c, tx)
	if err != nil {
		bru.tRep.RollBack(c, tx)
		return buyReportInfo, err
	}

	// ファイル名の生成
	buyReportIdStr := strconv.Itoa(*buyReportInfo.Id)
	filename := generateFileName(buyReportIdStr, file)

	// financial_recordの年度の取得
	var year string
	row, err := bru.bRep.GetYearByBuyReportId(c, tx, buyReportIdStr)
	if err != nil {
		bru.tRep.RollBack(c, tx)
		return buyReportInfo, err
	}
	if err = row.Scan(&year); err != nil {
		bru.tRep.RollBack(c, tx)
		return buyReportInfo, err
	}

	// ファイルのアップロード
	fileInfo, err := bru.oRep.UploadFile(c, file, year, DIR_NAME, filename)
	if err != nil {
		bru.tRep.RollBack(c, tx)
		return buyReportInfo, err
	}

	// ファイル情報のデータベース登録
	err = bru.bRep.CreatePaymentReceipt(c, tx, fileInfo)
	if err != nil {
		bru.tRep.RollBack(c, tx)
		return buyReportInfo, err
	}

	// コミットしてトランザクション終了
	if err := bru.tRep.Commit(c, tx); err != nil {
		return buyReportInfo, err
	}

	// 更新データ取得
	row, err = bru.bRep.GetBuyReportById(c, buyReportIdStr)
	if err != nil {
		return buyReportInfo, err
	}

	err = row.Scan(
		&resBuyReport.Id,
		&resBuyReport.FestivalItemID,
		&resBuyReport.Amount,
		&resBuyReport.PaidBy,
	)
	if err != nil {
		return buyReportInfo, err
	}

	return resBuyReport, nil
}

func (bru *buyReportUseCase) UpdateBuyReport(c context.Context, buyReportId string, buyReportInfo PostBuyReport, file *multipart.FileHeader) (PostBuyReport, error) {
	var resBuyReport PostBuyReport
	// トランザクションスタート
	tx, _ := bru.tRep.StartTransaction(c)

	// buy_report の更新
	err := bru.bRep.UpdateBuyReport(c, tx, buyReportId, buyReportInfo)
	if err != nil {
		bru.tRep.RollBack(c, tx)
		return resBuyReport, err
	}

	// ファイルがある場合の処理
	if file != nil {
		var paymentReceipt PaymentReceiptWithYear
		// 登録されているファイル情報の取得
		row, err := bru.bRep.GetPaymentReceipt(c, tx, buyReportId)
		if err != nil {
			bru.tRep.RollBack(c, tx)
			return resBuyReport, err
		}
		err = row.Scan(
			&paymentReceipt.ID,
			&paymentReceipt.BuyReportID,
			&paymentReceipt.BucketName,
			&paymentReceipt.FileName,
			&paymentReceipt.FileType,
			&paymentReceipt.Remark,
			&paymentReceipt.CreatedAt,
			&paymentReceipt.UpdatedAt,
			&paymentReceipt.Year,
		)
		if err != nil {
			bru.tRep.RollBack(c, tx)
			return resBuyReport, err
		}

		// 登録されているファイルの削除
		filePath := convertFilePath(paymentReceipt)
		err = bru.oRep.DeleteFile(c, filePath)
		if err != nil {
			bru.tRep.RollBack(c, tx)
			return resBuyReport, err
		}

		// ファイル名生成
		newFilename := generateFileName(buyReportId, file)

		year := strconv.Itoa(paymentReceipt.Year)
		// 新ファイルのアップロード
		fileInformation, err := bru.oRep.UploadFile(c, file, year, DIR_NAME, newFilename)
		if err != nil {
			bru.tRep.RollBack(c, tx)
			return resBuyReport, err
		}

		// ファイル情報のデータベース更新
		err = bru.bRep.UpdatePaymentReceipt(c, tx, buyReportId, fileInformation)
		if err != nil {
			bru.tRep.RollBack(c, tx)
			return resBuyReport, err
		}
	}

	// コミットしてトランザクション終了
	if err := bru.tRep.Commit(c, tx); err != nil {
		return resBuyReport, err
	}

	// 更新データ取得
	row, err := bru.bRep.GetBuyReportById(c, buyReportId)
	if err != nil {
		return resBuyReport, err
	}

	err = row.Scan(
		&resBuyReport.Id,
		&resBuyReport.FestivalItemID,
		&resBuyReport.Amount,
		&resBuyReport.PaidBy,
	)
	if err != nil {
		return resBuyReport, err
	}

	return resBuyReport, nil
}

func (bru *buyReportUseCase) DeleteBuyReport(c context.Context, buyReportId string) error {
	// トランザクションスタート
	tx, _ := bru.tRep.StartTransaction(c)

	// 登録されているファイル情報の取得
	var paymentReceipt PaymentReceiptWithYear
	row, err := bru.bRep.GetPaymentReceipt(c, tx, buyReportId)
	if err != nil {
		bru.tRep.RollBack(c, tx)
		return err
	}
	err = row.Scan(
		&paymentReceipt.ID,
		&paymentReceipt.BuyReportID,
		&paymentReceipt.BucketName,
		&paymentReceipt.FileName,
		&paymentReceipt.FileType,
		&paymentReceipt.Remark,
		&paymentReceipt.CreatedAt,
		&paymentReceipt.UpdatedAt,
		&paymentReceipt.Year,
	)
	if err != nil {
		bru.tRep.RollBack(c, tx)
		return err
	}

	// 登録されているファイルの削除
	filePath := convertFilePath(paymentReceipt)
	err = bru.oRep.DeleteFile(c, filePath)
	if err != nil {
		bru.tRep.RollBack(c, tx)
		return err
	}

	// buy_reportの削除
	err = bru.bRep.DeleteBuyReport(c, tx, buyReportId)
	if err != nil {
		bru.tRep.RollBack(c, tx)
		return err
	}

	// コミットしてトランザクション終了
	if err := bru.tRep.Commit(c, tx); err != nil {
		return err
	}

	return nil
}

func (bru *buyReportUseCase) GetBuyReports(c context.Context, year string) ([]BuyReportDetail, error) {
	var buyReportDetails []BuyReportDetail

	rows, err := bru.bRep.AllByPeriod(c, year)
	if err != nil {
		return []BuyReportDetail{}, nil
	}
	defer rows.Close()

	for rows.Next() {
		detail := BuyReportDetail{}
		err := rows.Scan(
			&detail.Amount,
			&detail.DivisionName,
			&detail.FestivalItemName,
			&detail.FinancialRecordName,
			&detail.Id,
			&detail.IsPacked,
			&detail.IsSettled,
			&detail.PaidBy,
			&detail.ReportDate,
		)

		if err != nil {
			return nil, errors.Wrapf(err, "failed to scan SQL row")
		}

		buyReportDetails = append(buyReportDetails, detail)
	}

	return buyReportDetails, nil
}

func (bru *buyReportUseCase) UpdateBuyReportStatus(c context.Context, buyReportId string, requestBody PutBuyReport) (BuyReportDetail, error) {

	detail := BuyReportDetail{}

	err := bru.bRep.UpdateBuyReportStatus(c, buyReportId, requestBody)
	if err != nil {
		return BuyReportDetail{}, err
	}

	row, err := bru.bRep.GetByBuyReportId(c, buyReportId)
	if err != nil {
		return BuyReportDetail{}, err
	}

	err = row.Scan(
		&detail.Amount,
		&detail.DivisionName,
		&detail.FestivalItemName,
		&detail.FinancialRecordName,
		&detail.Id,
		&detail.IsPacked,
		&detail.IsSettled,
		&detail.PaidBy,
		&detail.ReportDate,
	)

	if err != nil {
		return detail, errors.Wrapf(err, "failed to scan SQL row for buy report id %s", buyReportId)
	}

	return detail, nil
}

type PostBuyReport = generated.BuyReport
type PaymentReceiptWithYear = domain.PaymentReceiptWithYear
type BuyReportDetail = generated.BuyReportDetail
type PutBuyReport = generated.PutBuyReportStatusBuyReportIdJSONRequestBody

var DIR_NAME = "receipts"

func generateFileName(buyReportId string, file *multipart.FileHeader) string {
	fileSplits := strings.Split(file.Filename, ".")
	today := time.Now()
	dateStr := today.Format("20060102")
	filename := "No" + buyReportId + "_receipt_" + dateStr + "." + fileSplits[len(fileSplits)-1]
	return filename
}

func convertFilePath(paymentReceipt PaymentReceiptWithYear) string {
	filePath := "/" + strconv.Itoa(paymentReceipt.Year) + "/" + DIR_NAME + "/" + paymentReceipt.FileName
	return filePath
}
