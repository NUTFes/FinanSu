package usecase

import (
	"context"
	"mime/multipart"
	"strconv"
	"time"

	rep "github.com/NUTFes/FinanSu/api/externals/repository"
)

type objectUploadUseCase struct {
	rep rep.ObjectHandleRepository
}

type ObjectUploadUseCase interface {
	UploadFile(context.Context, *multipart.FileHeader) error
}

func NewObjectUploadUseCase(rep rep.ObjectHandleRepository) ObjectUploadUseCase {
	return &objectUploadUseCase{rep}
}

func (b *objectUploadUseCase) UploadFile(c context.Context, file *multipart.FileHeader) error {
	dirName := "receipts"
	fileName := file.Filename
	year := strconv.Itoa(time.Now().Year())
	if _, err := b.rep.UploadFile(c, file, year, dirName, fileName); err != nil {
		return err
	}

	return nil
}
