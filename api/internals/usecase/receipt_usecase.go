package usecase

import (
	"context"

	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/pkg/errors"
)

type receiptUseCase struct {
	rep rep.ReceiptRepository
}

type ReceiptUseCase interface {
	GetAllReceipts(context.Context) ([]domain.Receipt, error)
	GetReceiptByID(context.Context, string) (domain.Receipt, error)
	GetReceiptByPurchaseReportID(context.Context, string) ([]domain.Receipt, error)
	CreateReceipt(context.Context, domain.Receipt) (domain.Receipt, error)
	UpdateReceipt(context.Context, string, domain.Receipt) (domain.Receipt, error)
	DestroyReceipt(context.Context, string) error
}

func NewReceiptUseCase(rep rep.ReceiptRepository) ReceiptUseCase {
	return &receiptUseCase{rep}
}

func (r *receiptUseCase) GetAllReceipts(c context.Context) ([]domain.Receipt, error) {
	receipt := domain.Receipt{}
	var receipts []domain.Receipt

	//クエリ実行
	rows, err := r.rep.All(c)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		err := rows.Scan(
			&receipt.ID,
			&receipt.PurchaseReportID,
			&receipt.BucketName,
			&receipt.FileName,
			&receipt.FileType,
			&receipt.Remark,
			&receipt.CreatedAt,
			&receipt.UpdatedAt,
		)

		if err != nil {
			return nil, errors.Wrapf(err, "can not connect SQL")
		}
		receipts = append(receipts, receipt)
	}
	return receipts, nil
}

func (r *receiptUseCase) GetReceiptByID(c context.Context, id string) (domain.Receipt, error) {
	var receipt domain.Receipt
	row, err := r.rep.Find(c, id)
	err = row.Scan(
		&receipt.ID,
		&receipt.PurchaseReportID,
		&receipt.BucketName,
		&receipt.FileName,
		&receipt.FileType,
		&receipt.Remark,
		&receipt.CreatedAt,
		&receipt.UpdatedAt,
	)
	if err != nil {
		return receipt, err
	}
	return receipt, nil
}

func (r *receiptUseCase) GetReceiptByPurchaseReportID(c context.Context, PurchaseReportID string) ([]domain.Receipt, error) {
	receipt := domain.Receipt{}
	var receipts []domain.Receipt
	rows, err := r.rep.FindByPurchaseReportID(c, PurchaseReportID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		err := rows.Scan(
			&receipt.ID,
			&receipt.PurchaseReportID,
			&receipt.BucketName,
			&receipt.FileName,
			&receipt.FileType,
			&receipt.Remark,
			&receipt.CreatedAt,
			&receipt.UpdatedAt,
		)

		if err != nil {
			return nil, errors.Wrapf(err, "can not connect SQL")
		}
		receipts = append(receipts, receipt)
	}
	return receipts, nil
}

func (r *receiptUseCase) CreateReceipt(c context.Context, receipt domain.Receipt) (domain.Receipt, error) {
	var latestReceipt domain.Receipt
	err := r.rep.Create(c, receipt)
	row, err := r.rep.FindLatestRecord(c)

	err = row.Scan(
		&latestReceipt.ID,
		&latestReceipt.PurchaseReportID,
		&latestReceipt.BucketName,
		&latestReceipt.FileName,
		&latestReceipt.FileType,
		&latestReceipt.Remark,
		&latestReceipt.CreatedAt,
		&latestReceipt.UpdatedAt,
	)
	if err != nil {
		return latestReceipt, err
	}
	return latestReceipt, nil
}

func (r *receiptUseCase) UpdateReceipt(c context.Context, id string, receipt domain.Receipt) (domain.Receipt, error) {
	updatedReceipt := domain.Receipt{}
	err := r.rep.Update(c, id, receipt)
	row, err := r.rep.Find(c,id)
	err = row.Scan(
		&updatedReceipt.ID,
		&updatedReceipt.PurchaseReportID,
		&updatedReceipt.BucketName,
		&updatedReceipt.FileName,
		&updatedReceipt.FileType,
		&updatedReceipt.Remark,
		&updatedReceipt.CreatedAt,
		&updatedReceipt.UpdatedAt,
	)
	if err != nil {
		return updatedReceipt, err
	}
	return updatedReceipt, nil
}

func (r *receiptUseCase) DestroyReceipt(c context.Context, id string) error {
	err := r.rep.Destroy(c, id)
	return err
}
