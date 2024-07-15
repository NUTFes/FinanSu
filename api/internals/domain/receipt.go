package domain

import (
	"time"
)

type Receipt struct {
	ID        			int       `json:"id"`
	PurchaseReportID	uint      `json:"purchaseReportID"`
	BucketName		    string    `json:"bucketName"`
	FileName			string    `json:"fileName"`
	FileType			string    `json:"fileType"`
	Remark    			string    `json:"remark"`
	CreatedAt 			time.Time `json:"createdAt"`
	UpdatedAt 			time.Time `json:"updatedAt"`
}

