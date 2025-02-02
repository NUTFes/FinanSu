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
)

type buyReportUseCase struct {
	bRep rep.BuyReportRepository
	tRep rep.TransactionRepository
	oRep rep.ObjectHandleRepository
}

type BuyReportUseCase interface {
	CreateBuyReport(context.Context, PostBuyReport, *multipart.FileHeader) (PostBuyReport, error)
	UpdateBuyReport(context.Context, string, PostBuyReport, *multipart.FileHeader) (PostBuyReport, error)
}

func NewBuyReportUseCase(bRep rep.BuyReportRepository, tRep rep.TransactionRepository, oRep rep.ObjectHandleRepository) BuyReportUseCase {
	return &buyReportUseCase{bRep, tRep, oRep}
}

func (bru *buyReportUseCase) CreateBuyReport(c context.Context, buyReportInfo PostBuyReport, file *multipart.FileHeader) (PostBuyReport, error) {
	// トランザクションスタート
	tx, _ := bru.tRep.StartTransaction(c)

	// buy_report の作成
	buyReportId, err := bru.bRep.CreateBuyReport(c, tx, buyReportInfo)
	*buyReportInfo.Id = int(buyReportId)
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
	filename := generateFileName(*buyReportInfo.Id, file)

	// ファイルのアップロード
	fileInfo, err := bru.oRep.UploadFile(c, file, DIR_NAME, filename)
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

	return buyReportInfo, nil
}

func (bru *buyReportUseCase) UpdateBuyReport(c context.Context, id string, buyReportInfo PostBuyReport, file *multipart.FileHeader) (PostBuyReport, error) {
	// トランザクションスタート
	tx, _ := bru.tRep.StartTransaction(c)

	// buy_report の更新
	err := bru.bRep.UpdateBuyReport(c, tx, id, buyReportInfo)
	if err != nil {
		bru.tRep.RollBack(c, tx)
		return buyReportInfo, err
	}

	// ファイルがある場合の処理
	if file != nil {
		var paymentReceipt PaymentReceiptWithYear
		// 登録されているファイル情報の取得
		row, err := bru.bRep.GetPaymentReceipt(c, tx, id)
		if err != nil {
			bru.tRep.RollBack(c, tx)
			return buyReportInfo, err
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
			return buyReportInfo, err
		}

		// 登録されているファイルの削除
		filePath := convertFilePath(paymentReceipt)
		err = bru.oRep.DeleteFile(c, filePath)
		if err != nil {
			bru.tRep.RollBack(c, tx)
			return buyReportInfo, err
		}
	}

	// // ファイル名の生成
	// filename := generateFileName(*buyReportInfo.Id, file)

	// // ファイルのアップロード
	// fileInfo, err := bru.oRep.UploadFile(c, file, DIR_NAME, filename)
	// if err != nil {
	// 	bru.tRep.RollBack(c, tx)
	// 	return buyReportInfo, err
	// }

	// // ファイル情報のデータベース登録
	// err = bru.bRep.CreatePaymentReceipt(c, tx, fileInfo)
	// if err != nil {
	// 	bru.tRep.RollBack(c, tx)
	// 	return buyReportInfo, err
	// }

	// コミットしてトランザクション終了
	if err := bru.tRep.Commit(c, tx); err != nil {
		return buyReportInfo, err
	}

	return buyReportInfo, nil
}

type PostBuyReport = generated.BuyReport
type PaymentReceiptWithYear = domain.PaymentReceiptWithYear

var DIR_NAME = "receipts"

func generateFileName(buyReportId int, file *multipart.FileHeader) string {
	fileSplits := strings.Split(file.Filename, ".")
	today := time.Now()
	dateStr := today.Format("20060102")
	filename := "No" + strconv.Itoa(buyReportId) + "_receipt_" + dateStr + "." + fileSplits[len(fileSplits)-1]
	return filename
}

func convertFilePath(paymentRececipt PaymentReceiptWithYear) string {
	filePath := "/" + strconv.Itoa(paymentRececipt.Year) + "/" + DIR_NAME + "/" + paymentRececipt.FileName
	return filePath
}
