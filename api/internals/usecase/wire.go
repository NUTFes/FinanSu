//go:build wireinject
// +build wireinject

package usecase

import (
	"github.com/google/wire"
)

// UseCaseProviderSet - UseCase層のProviderセット
var UseCaseProviderSet = wire.NewSet(
	NewActivityUseCase,
	NewActivityInformationUseCase,
	NewActivityStyleUseCase,
	NewBudgetUseCase,
	NewBureauUseCase,
	NewBuyReportUseCase,
	NewDepartmentUseCase,
	NewDivisionUseCase,
	NewExpenseUseCase,
	NewFestivalItemUseCase,
	NewFinancialRecordUseCase,
	NewFundInformationUseCase,
	NewIncomeUseCase,
	NewIncomeExpenditureManagementUseCase,
	NewMailAuthUseCase,
	NewObjectUploadUseCase,
	NewPasswordResetTokenUseCase,
	NewPurchaseItemUseCase,
	NewPurchaseOrderUseCase,
	NewPurchaseReportUseCase,
	NewReceiptUseCase,
	NewSourceUseCase,
	NewSponsorUseCase,
	NewSponsorStyleUseCase,
	NewTeacherUseCase,
	NewUserUseCase,
	NewYearUseCase,
)
