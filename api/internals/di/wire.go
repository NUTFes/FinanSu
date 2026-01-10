//go:build wireinject
// +build wireinject

package di

import (
	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/drivers/mc"
	"github.com/NUTFes/FinanSu/api/drivers/server"
	"github.com/NUTFes/FinanSu/api/externals/handler"
	"github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/google/wire"
	"github.com/labstack/echo/v4"
)

// ServerComponents はサーバーコンポーネントをまとめる構造体
type ServerComponents struct {
	Client db.Client
	Echo   *echo.Echo
}

// 基盤Provider群

// ProvideDBClient - DB接続のProvider
func ProvideDBClient() (db.Client, error) {
	return db.ConnectMySQL()
}

// ProvideMinioClient - MinioClientのProvider
func ProvideMinioClient() (mc.Client, error) {
	return mc.InitMinioClient()
}

// ProvideCrud - AbstractCrudのProvider
func ProvideCrud(client db.Client) abstract.Crud {
	return abstract.NewCrud(client)
}

// ProvideServer - ServerのProvider
func ProvideServer(h *handler.Handler) *echo.Echo {
	return server.RunServer(h)
}

// ProvideServerComponents - ServerComponentsのProvider
func ProvideServerComponents(client db.Client, echo *echo.Echo) *ServerComponents {
	return &ServerComponents{
		Client: client,
		Echo:   echo,
	}
}

// InitializeServer - Wireで生成される関数
func InitializeServer() (*ServerComponents, error) {
	wire.Build(
		// 基盤Provider群
		ProvideDBClient,
		ProvideMinioClient,
		ProvideCrud,

		// 各層のProviderセット
		repository.RepositoryProviderSet,
		usecase.UseCaseProviderSet,
		handler.HandlerProviderSet,

		// Server
		ProvideServer,
		ProvideServerComponents,
	)
	return nil, nil
}
