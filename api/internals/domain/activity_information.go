package domain

import (
	"time"
)

type ActivityInformation struct {
	ID				int			`json:"id"`
	ActivityId		int			`json:"activityID"`
	BucketName		string		`json:"bucketName"`
	FileName		string		`json:"fileName"`
	FileType 		string		`json:"fileType"`
	DesignProgress	int			`json:"designProgress"`
	FileInformation string		`json:"fileInformation"`
	CreatedAt		time.Time	`json:"createdAt"`
	UpdatedAt		time.Time	`json:"updatedAt"`
}
