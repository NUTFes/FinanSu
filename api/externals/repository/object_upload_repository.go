package repository

import (
	"context"
	"fmt"

	"github.com/NUTFes/FinanSu/api/drivers/mc"
)

type objectUploadRepository struct {
	client mc.Client
}

type ObjectUploadRepository interface {
	GetBucket(context.Context) error
}

func NewObjectUploadRepository(c mc.Client) ObjectUploadRepository {
	return &objectUploadRepository{c}
}

// バケットが存在するか
func (or *objectUploadRepository) GetBucket(c context.Context) error {
	isExist, err := or.client.BucketExists(c, "test")
	if err != nil {
		return err
	}

	fmt.Println(isExist)

	return nil
}
