package handler

import (
	"github.com/NUTFes/FinanSu/api/internals/usecase"
)

type Handler struct {
	activityUseCase                    usecase.ActivityUseCase
	activityInformationUseCase         usecase.ActivityInformationUseCase
	activityStyleUseCase               usecase.ActivityStyleUseCase
	bureauUseCase                      usecase.BureauUseCase
	buyReportUseCase                   usecase.BuyReportUseCase
	departmentUseCase                  usecase.DepartmentUseCase
	divisionUseCase                    usecase.DivisionUseCase
	festivalItemUseCase                usecase.FestivalItemUseCase
	financialRecordUseCase             usecase.FinancialRecordUseCase
	incomeUseCase                      usecase.IncomeUseCase
	incomeExpenditureManagementUseCase usecase.IncomeExpenditureManagementUseCase
	mailAuthUseCase                    usecase.MailAuthUseCase
	objectUploadUseCase                usecase.ObjectUploadUseCase
	passwordResetTokenUseCase          usecase.PasswordResetTokenUseCase
	sponsorUseCase                     usecase.SponsorUseCase
	sponsorStyleUseCase                usecase.SponsorStyleUseCase
	teacherUseCase                     usecase.TeacherUseCase
	userUseCase                        usecase.UserUseCase
	yearUseCase                        usecase.YearUseCase
	sponsorshipActivityUseCase         usecase.SponsorshipActivityUseCase
}

func NewHandler(
	activityUseCase usecase.ActivityUseCase,
	activityInformationUseCase usecase.ActivityInformationUseCase,
	activityStyleUseCase usecase.ActivityStyleUseCase,
	bureauUseCase usecase.BureauUseCase,
	buyReportUseCase usecase.BuyReportUseCase,
	departmentUseCase usecase.DepartmentUseCase,
	divisionUseCase usecase.DivisionUseCase,
	festivalItemUseCase usecase.FestivalItemUseCase,
	financialRecordUseCase usecase.FinancialRecordUseCase,
	incomeUseCase usecase.IncomeUseCase,
	incomeExpenditureManagementUseCase usecase.IncomeExpenditureManagementUseCase,
	mailAuthUseCase usecase.MailAuthUseCase,
	objectUploadUseCase usecase.ObjectUploadUseCase,
	passwordResetTokenUseCase usecase.PasswordResetTokenUseCase,
	sponsorUseCase usecase.SponsorUseCase,
	sponsorStyleUseCase usecase.SponsorStyleUseCase,
	teacherUseCase usecase.TeacherUseCase,
	userUseCase usecase.UserUseCase,
	yearUseCase usecase.YearUseCase,
	sponsorshipActivityUseCase usecase.SponsorshipActivityUseCase,
) *Handler {
	return &Handler{
		activityUseCase:                    activityUseCase,
		activityInformationUseCase:         activityInformationUseCase,
		activityStyleUseCase:               activityStyleUseCase,
		bureauUseCase:                      bureauUseCase,
		buyReportUseCase:                   buyReportUseCase,
		departmentUseCase:                  departmentUseCase,
		divisionUseCase:                    divisionUseCase,
		festivalItemUseCase:                festivalItemUseCase,
		financialRecordUseCase:             financialRecordUseCase,
		incomeUseCase:                      incomeUseCase,
		incomeExpenditureManagementUseCase: incomeExpenditureManagementUseCase,
		mailAuthUseCase:                    mailAuthUseCase,
		objectUploadUseCase:                objectUploadUseCase,
		passwordResetTokenUseCase:          passwordResetTokenUseCase,
		sponsorUseCase:                     sponsorUseCase,
		sponsorStyleUseCase:                sponsorStyleUseCase,
		teacherUseCase:                     teacherUseCase,
		userUseCase:                        userUseCase,
		yearUseCase:                        yearUseCase,
		sponsorshipActivityUseCase:         sponsorshipActivityUseCase,
	}
}
