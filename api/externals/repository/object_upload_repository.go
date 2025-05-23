package repository

import (
	"context"
	"log"
	"mime/multipart"

	"github.com/NUTFes/FinanSu/api/drivers/mc"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	minio "github.com/minio/minio-go/v7"
)

type objectHandleRepository struct {
	client mc.Client
}

type ObjectHandleRepository interface {
	UploadFile(context.Context, *multipart.FileHeader, string, string, string) (FileInfo, error)
	DeleteFile(context.Context, string) error
}

func NewObjectHandleRepository(c mc.Client) ObjectHandleRepository {
	return &objectHandleRepository{c}
}

// 画像をアップロード
func (or *objectHandleRepository) UploadFile(c context.Context, file *multipart.FileHeader, year string, dirName string, fileName string) (FileInfo, error) {
	size := file.Size
	registerFilePath := "/" + year + "/" + dirName + "/" + fileName

	var fileInfo FileInfo

	openFile, err := file.Open()
	if err != nil {
		log.Println(err)
		return fileInfo, err
	}
	defer func() {
		if err := openFile.Close(); err != nil {
			log.Println(err)
		}
	}()

	info, err := or.client.PutObject(c, BUCKET_NAME, registerFilePath, openFile, size, minio.PutObjectOptions{})
	if err != nil {
		log.Println(err)
		return fileInfo, err
	}
	log.Println(info)

	fileInfo.FileName = fileName
	fileInfo.FileType = file.Header.Get("Content-Type")
	fileInfo.Size = size
	return fileInfo, nil
}

// ファイルを削除
func (or *objectHandleRepository) DeleteFile(c context.Context, fileName string) error {
	err := or.client.RemoveObject(c, BUCKET_NAME, fileName, minio.RemoveObjectOptions{})
	if err != nil {
		log.Println(err)
		return err
	}
	return nil
}

type FileInfo = domain.FileInformation

var BUCKET_NAME = "finansu"
