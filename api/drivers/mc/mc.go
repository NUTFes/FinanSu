package mc

import (
	"fmt"
	"log"

	"github.com/joho/godotenv"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

type Client struct {
	*minio.Client
}

func InitMinioClient() (Client, error) {
	err := godotenv.Load("env/dev.env")
	if err != nil {
		fmt.Println(err)
	}
	endpoint := "minio"
	// port := "9000"
	accessKeyID := "user"
	secretAccessKey := "password"
	useSSL := false

	// Initialize minio client object.
	minioClient, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
		Secure: useSSL,
	})
	if err != nil {
		log.Fatalln(err)
		return Client{}, err
	}

	log.Printf("%#v\n", minioClient) // minioClient is now set up
	return Client{minioClient}, nil
}
