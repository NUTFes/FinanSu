//go:build wireinject
// +build wireinject

package controller

import (
	"github.com/google/wire"
)

// ControllerProviderSet - Controller層のProviderセット
var ControllerProviderSet = wire.NewSet(
	NewActivityController,
	NewActivityInformationController,
	NewActivityStyleController,
	NewBudgetController,
	NewBureauController,
	NewBuyReportController,
	NewDepartmentController,
	NewDivisionController,
	NewExpenseController,
	NewFestivalItemController,
	NewFinancialRecordController,
	NewFundInformationController,
	NewHealthCheckController,
	NewIncomeController,
	NewIncomeExpenditureManagementController,
	NewMailAuthController,
	NewObjectUploadController,
	NewPasswordResetTokenController,
	NewPurchaseItemController,
	NewPurchaseOrderController,
	NewPurchaseReportController,
	NewReceiptController,
	NewSourceController,
	NewSponsorController,
	NewSponsorStyleController,
	NewTeacherController,
	NewUserController,
	NewYearController,
)
