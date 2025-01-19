package repository

import (
	"context"
	"log"
	"mime/multipart"

	"github.com/NUTFes/FinanSu/api/drivers/mc"
	minio "github.com/minio/minio-go/v7"
)

type objectUploadRepository struct {
	client mc.Client
}

type ObjectUploadRepository interface {
	UploadFile(context.Context, *multipart.FileHeader) error
}

func NewObjectUploadRepository(c mc.Client) ObjectUploadRepository {
	return &objectUploadRepository{c}
}

// 画像をアップロード
func (or *objectUploadRepository) UploadFile(c context.Context, file *multipart.FileHeader) error {
	size := file.Size
	fileName := "/2024/receipts/" + file.Filename
	openFile, err := file.Open()
	if err != nil {
		log.Println(err)
		return err
	}
	defer openFile.Close()

	info, err := or.client.PutObject(c, "finansu", fileName, openFile, size, minio.PutObjectOptions{})
	if err != nil {
		log.Println(err)
		return err
	}
	log.Println(info)

	return nil
}
