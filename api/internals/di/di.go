package di

import (
	"fmt"
	"log"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/drivers/mc"
	"github.com/NUTFes/FinanSu/api/drivers/server"
	"github.com/NUTFes/FinanSu/api/externals/handler"
	"github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/labstack/echo/v4"
)

func InitializeServer() (db.Client, *echo.Echo) {
	// DB接続
	client, err := db.ConnectMySQL()
	if err != nil {
		log.Fatal("db error")
	}

	crud := abstract.NewCrud(client)

	minioClient, err := mc.InitMinioClient()
	if err != nil {
		fmt.Println(err)
	}

	fmt.Println(minioClient)

	// Repository
	activityRepository := repository.NewActivityRepository(client, crud)
	activityInformationRepository := repository.NewActivityInformationsRepository(client, crud)
	activityStyleRepository := repository.NewActivityStyleRepository(client, crud)
	bureauRepository := repository.NewBureauRepository(client, crud)
	buyReportRepository := repository.NewBuyReportRepository(client, crud)
	departmentRepository := repository.NewDepartmentRepository(client, crud)
	divisionRepository := repository.NewDivisionRepository(client, crud)
	festivalItemRepository := repository.NewFestivalItemRepository(client, crud)
	financialRecordRepository := repository.NewFinancialRecordRepository(client, crud)
	fundInformationRepository := repository.NewFundInformationRepository(client, crud)
	mailAuthRepository := repository.NewMailAuthRepository(client, crud)
	objectHandleRepository := repository.NewObjectHandleRepository(minioClient)
	passwordResetTokenRepository := repository.NewPasswordResetTokenRepository(client, crud)
	sessionRepository := repository.NewSessionRepository(client)
	sponsorRepository := repository.NewSponsorRepository(client, crud)
	sponsorStyleRepository := repository.NewSponsorStyleRepository(client, crud)
	teacherRepository := repository.NewTeacherRepository(client, crud)
	transactionRepository := repository.NewTransactionRepository(client, crud)
	userRepository := repository.NewUserRepository(client, crud)
	yearRepository := repository.NewYearRepository(client, crud)
	// ↓

	// UseCase
	activityUseCase := usecase.NewActivityUseCase(activityRepository)
	activityInformationUseCase := usecase.NewActivityInformationUseCase(
		activityInformationRepository,
	)
	activityStyleUseCase := usecase.NewActivityStyleUseCase(activityStyleRepository)
	bureauUseCase := usecase.NewBureauUseCase(bureauRepository)
	buyReportUseCase := usecase.NewBuyReportUseCase(buyReportRepository, transactionRepository, objectHandleRepository)
	departmentUseCase := usecase.NewDepartmentUseCase(departmentRepository)
	divisionUseCase := usecase.NewDivisionUseCase(divisionRepository)
	festivalUseCase := usecase.NewFestivalItemUseCase(festivalItemRepository, transactionRepository)
	financialRecordUseCase := usecase.NewFinancialRecordUseCase(financialRecordRepository)
	fundInformationUseCase := usecase.NewFundInformationUseCase(fundInformationRepository)
	mailAuthUseCase := usecase.NewMailAuthUseCase(mailAuthRepository, sessionRepository)
	objectHandleUseCase := usecase.NewObjectUploadUseCase(objectHandleRepository)
	passwordResetTokenUseCase := usecase.NewPasswordResetTokenUseCase(
		passwordResetTokenRepository,
		userRepository,
		mailAuthRepository,
	)
	sponsorUseCase := usecase.NewSponsorUseCase(sponsorRepository)
	sponsorStyleUseCase := usecase.NewSponsorStyleUseCase(sponsorStyleRepository)
	teacherUseCase := usecase.NewTeacherUseCase(teacherRepository)
	userUseCase := usecase.NewUserUseCase(userRepository, sessionRepository)
	yearUseCase := usecase.NewYearUseCase(yearRepository)
	// ↓

	handler := handler.NewHandler(
		activityUseCase,
		activityInformationUseCase,
		activityStyleUseCase,
		bureauUseCase,
		buyReportUseCase,
		departmentUseCase,
		divisionUseCase,
		festivalUseCase,
		financialRecordUseCase,
		fundInformationUseCase,
		mailAuthUseCase,
		objectHandleUseCase,
		passwordResetTokenUseCase,
		sponsorUseCase,
		sponsorStyleUseCase,
		teacherUseCase,
		userUseCase,
		yearUseCase,
	)

	// Server
	e := server.RunServer(handler)

	return client, e
}
