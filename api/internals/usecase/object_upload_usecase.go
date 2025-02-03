package usecase

import (
	"context"
	"mime/multipart"

	rep "github.com/NUTFes/FinanSu/api/externals/repository"
)

type objectUploadUseCase struct {
	rep rep.ObjectUploadRepository
}

type ObjectUploadUseCase interface {
	UploadFile(context.Context, *multipart.FileHeader) error
}

func NewObjectUploadUseCase(rep rep.ObjectUploadRepository) ObjectUploadUseCase {
	return &objectUploadUseCase{rep}
}

func (b *objectUploadUseCase) UploadFile(c context.Context, file *multipart.FileHeader) error {
	if err := b.rep.UploadFile(c, file); err != nil {
		return err
	}

	return nil
}
