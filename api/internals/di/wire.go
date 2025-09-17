//go:build wireinject
// +build wireinject

package di

import (
	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/drivers/mc"
	"github.com/NUTFes/FinanSu/api/drivers/server"
	"github.com/NUTFes/FinanSu/api/externals/controller"
	"github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/NUTFes/FinanSu/api/router"
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

// ProvideRouter - Router構築のProvider
func ProvideRouter(
	activityController controller.ActivityController,
	activityInformationController controller.ActivityInformationController,
	activityStyleController controller.ActivityStyleController,
	budgetController controller.BudgetController,
	bureauController controller.BureauController,
	buyReportController controller.BuyReportController,
	departmentController controller.DepartmentController,
	divisionController controller.DivisionController,
	expenseController controller.ExpenseController,
	festivalItemController controller.FestivalItemController,
	financialRecordController controller.FinancialRecordController,
	fundInformationController controller.FundInformationController,
	healthcheckController controller.HealthcheckController,
	incomeController controller.IncomeController,
	incomeExpenditureManagementController controller.IncomeExpenditureManagementController,
	mailAuthController controller.MailAuthController,
	objectUploadController controller.ObjectUploadController,
	passwordResetTokenController controller.PasswordResetTokenController,
	purchaseItemController controller.PurchaseItemController,
	purchaseOrderController controller.PurchaseOrderController,
	purchaseReportController controller.PurchaseReportController,
	receiptController controller.ReceiptController,
	sourceController controller.SourceController,
	sponsorController controller.SponsorController,
	sponsorStyleController controller.SponsorStyleController,
	teacherController controller.TeacherController,
	userController controller.UserController,
	yearController controller.YearController,
) router.Router {
	return router.NewRouter(
		activityController,
		activityInformationController,
		activityStyleController,
		budgetController,
		bureauController,
		buyReportController,
		departmentController,
		divisionController,
		expenseController,
		festivalItemController,
		financialRecordController,
		fundInformationController,
		healthcheckController,
		incomeController,
		incomeExpenditureManagementController,
		mailAuthController,
		objectUploadController,
		passwordResetTokenController,
		purchaseItemController,
		purchaseOrderController,
		purchaseReportController,
		receiptController,
		sourceController,
		sponsorController,
		sponsorStyleController,
		teacherController,
		userController,
		yearController,
	)
}

// ProvideServer - ServerのProvider
func ProvideServer(router router.Router) *echo.Echo {
	return server.RunServer(router)
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
		controller.ControllerProviderSet,

		// Router/Server
		ProvideRouter,
		ProvideServer,
		ProvideServerComponents,
	)
	return nil, nil
}
