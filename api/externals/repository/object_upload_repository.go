package repository

import (
	"context"
	"log"
	"mime/multipart"
	"strconv"
	"time"

	"github.com/NUTFes/FinanSu/api/drivers/mc"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	minio "github.com/minio/minio-go/v7"
)

type objectHandleRepository struct {
	client mc.Client
}

type ObjectHandleRepository interface {
	UploadFile(context.Context, *multipart.FileHeader, string, string) (FileInfo, error)
}

func NewObjectHandleRepository(c mc.Client) ObjectHandleRepository {
	return &objectHandleRepository{c}
}

// 画像をアップロード
func (or *objectHandleRepository) UploadFile(c context.Context, file *multipart.FileHeader, dirName string, fileName string) (FileInfo, error) {
	currentYear := strconv.Itoa(time.Now().Year())
	size := file.Size
	registerFileName := "/" + currentYear + "/" + dirName + "/" + fileName

	var fileInfo FileInfo

	openFile, err := file.Open()
	if err != nil {
		log.Println(err)
		return fileInfo, err
	}
	defer openFile.Close()

	info, err := or.client.PutObject(c, BUCKET_NAME, registerFileName, openFile, size, minio.PutObjectOptions{})
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

type FileInfo = domain.FileInformation

var BUCKET_NAME = "finansu"
