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
	NewCampusDonationRepository,
	NewDepartmentRepository,
	NewDivisionRepository,
	NewExpenseRepository,
	NewFestivalItemRepository,
	NewFinancialRecordRepository,
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
	NewSponsorshipActivityRepository,
)
