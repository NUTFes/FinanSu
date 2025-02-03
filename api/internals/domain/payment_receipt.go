package domain

import (
	"time"
)

type PaymentReceipt struct {
	ID          int       `json:"id"`
	BuyReportID int       `json:"buyReportId"`
	BucketName  string    `json:"bucketName"`
	FileName    string    `json:"fileName"`
	FileType    string    `json:"fileType"`
	Remark      string    `json:"remark"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}
