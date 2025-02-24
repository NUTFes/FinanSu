package handler

import (
	"github.com/NUTFes/FinanSu/api/internals/usecase"
)

type Handler struct {
	activityUseCase            usecase.ActivityUseCase
	activityInformationUseCase usecase.ActivityInformationUseCase
	activityStyleUseCase       usecase.ActivityStyleUseCase
	bureauUseCase              usecase.BureauUseCase
	buyReportUseCase           usecase.BuyReportUseCase
	departmentUseCase          usecase.DepartmentUseCase
	divisionUseCase            usecase.DivisionUseCase
	festivalItemUseCase        usecase.FestivalItemUseCase
	financialRecordUseCase     usecase.FinancialRecordUseCase
	fundInformationUseCase     usecase.FundInformationUseCase
	mailAuthUseCase            usecase.MailAuthUseCase
	objectUploadUseCase        usecase.ObjectUploadUseCase
	passwordResetTokenUseCase  usecase.PasswordResetTokenUseCase
	sponsorUseCase             usecase.SponsorUseCase
	sponsorStyleUseCase        usecase.SponsorStyleUseCase
	teacherUseCase             usecase.TeacherUseCase
	userUseCase                usecase.UserUseCase
	yearUseCase                usecase.YearUseCase
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
	fundInformationUseCase usecase.FundInformationUseCase,
	mailAuthUseCase usecase.MailAuthUseCase,
	objectUploadUseCase usecase.ObjectUploadUseCase,
	passwordResetTokenUseCase usecase.PasswordResetTokenUseCase,
	sponsorUseCase usecase.SponsorUseCase,
	sponsorStyleUseCase usecase.SponsorStyleUseCase,
	teacherUseCase usecase.TeacherUseCase,
	userUseCase usecase.UserUseCase,
	yearUseCase usecase.YearUseCase,
) *Handler {
	return &Handler{
		activityUseCase:            activityUseCase,
		activityInformationUseCase: activityInformationUseCase,
		activityStyleUseCase:       activityStyleUseCase,
		bureauUseCase:              bureauUseCase,
		buyReportUseCase:           buyReportUseCase,
		departmentUseCase:          departmentUseCase,
		divisionUseCase:            divisionUseCase,
		festivalItemUseCase:        festivalItemUseCase,
		financialRecordUseCase:     financialRecordUseCase,
		fundInformationUseCase:     fundInformationUseCase,
		mailAuthUseCase:            mailAuthUseCase,
		objectUploadUseCase:        objectUploadUseCase,
		passwordResetTokenUseCase:  passwordResetTokenUseCase,
		sponsorUseCase:             sponsorUseCase,
		sponsorStyleUseCase:        sponsorStyleUseCase,
		teacherUseCase:             teacherUseCase,
		userUseCase:                userUseCase,
		yearUseCase:                yearUseCase,
	}
}
