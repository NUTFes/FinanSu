//go:build wireinject
// +build wireinject

package repository

import (
	"github.com/google/wire"
)

// RepositoryProviderSet - Repository層のProviderセット
var RepositoryProviderSet = wire.NewSet(
	NewActivityRepository,
	NewActivityInformationsRepository,
	NewActivityStyleRepository,
	NewBudgetRepository,
	NewBureauRepository,
	NewBuyReportRepository,
	NewDepartmentRepository,
	NewDivisionRepository,
	NewExpenseRepository,
	NewFestivalItemRepository,
	NewFinancialRecordRepository,
	NewFundInformationRepository,
	NewIncomeRepository,
	NewIncomeExpenditureManagementRepository,
	NewMailAuthRepository,
	NewObjectHandleRepository,
	NewPasswordResetTokenRepository,
	NewPurchaseItemRepository,
	NewPurchaseOrderRepository,
	NewPurchaseReportRepository,
	NewReceiptRepository,
	NewSessionRepository,
	NewSourceRepository,
	NewSponsorRepository,
	NewSponsorStyleRepository,
	NewTeacherRepository,
	NewTransactionRepository,
	NewUserRepository,
	NewYearRepository,
)
