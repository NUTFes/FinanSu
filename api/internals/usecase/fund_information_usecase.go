package usecase

import (
	"context"

	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/internals/domain"
)

type fundInformationUseCase struct {
	rep rep.FundInformationRepository
}

type FundInformationUseCase interface {
	GetFundInformations(context.Context) ([]domain.FundInformation, error)
	GetFundInformationByID(context.Context, string) (domain.FundInformation, error)
	CreateFundInformation(context.Context, string, string, string, string, string, string, string) (domain.FundInformation, error)
	UpdateFundInformation(context.Context, string, string, string, string, string, string, string, string) (domain.FundInformation, error)
	DestroyFundInformation(context.Context, string) error
	GetFundInformationDetails(context.Context) ([]domain.FundInformationDetail, error)
	GetFundInformationDetailByID(context.Context, string) (domain.FundInformationDetail, error)
	GetFundInformationDetailsByPeriod(context.Context, string) ([]domain.FundInformationDetail, error)
}

func NewFundInformationUseCase(rep rep.FundInformationRepository) FundInformationUseCase {
	return &fundInformationUseCase{rep}
}

// FundInformationsの取得(Get)
func (f *fundInformationUseCase) GetFundInformations(c context.Context) ([]domain.FundInformation, error) {
	fundInformation := domain.FundInformation{}
	var fundInformations []domain.FundInformation

	rows, err := f.rep.All(c)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		err := rows.Scan(
			&fundInformation.ID,
			&fundInformation.UserID,
			&fundInformation.TeacherID,
			&fundInformation.Price,
			&fundInformation.Remark,
			&fundInformation.IsFirstCheck,
			&fundInformation.IsLastCheck,
			&fundInformation.ReceivedAt,
			&fundInformation.CreatedAt,
			&fundInformation.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		fundInformations = append(fundInformations, fundInformation)
	}
	return fundInformations, nil
}

// FundInfomationの取得(Get)
func (f *fundInformationUseCase) GetFundInformationByID(c context.Context, id string) (domain.FundInformation, error) {
	fundInformation := domain.FundInformation{}

	row, err := f.rep.Find(c, id)
	err = row.Scan(
		&fundInformation.ID,
		&fundInformation.UserID,
		&fundInformation.TeacherID,
		&fundInformation.Price,
		&fundInformation.Remark,
		&fundInformation.IsFirstCheck,
		&fundInformation.IsLastCheck,
		&fundInformation.ReceivedAt,
		&fundInformation.CreatedAt,
		&fundInformation.UpdatedAt,
	)
	if err != nil {
		return fundInformation, err
	}
	return fundInformation, nil
}

// FundInfomationの作成(Create)
func (f *fundInformationUseCase) CreateFundInformation(
	c context.Context,
	userID string,
	teacherID string,
	price string,
	remark string,
	isFirstCheck string,
	isLastCheck string,
	receivedAt string,
) (domain.FundInformation, error) {
	latastFundInformation := domain.FundInformation{}
	err := f.rep.Create(c, userID, teacherID, price, remark, isFirstCheck, isLastCheck, receivedAt)
	row, err := f.rep.FindLatestRecord(c)
	err = row.Scan(
		&latastFundInformation.ID,
		&latastFundInformation.UserID,
		&latastFundInformation.TeacherID,
		&latastFundInformation.Price,
		&latastFundInformation.Remark,
		&latastFundInformation.IsFirstCheck,
		&latastFundInformation.IsLastCheck,
		&latastFundInformation.ReceivedAt,
		&latastFundInformation.CreatedAt,
		&latastFundInformation.UpdatedAt,
	)
	if err != nil {
		return latastFundInformation, err
	}
	return latastFundInformation, err
}

// FundInformationの修正(Update)
func (f *fundInformationUseCase) UpdateFundInformation(
	c context.Context,
	id string,
	userID string,
	teacherID string,
	price string,
	remark string,
	isFirstCheck string,
	isLastCheck string,
	receivedAt string,
) (domain.FundInformation, error) {
	updatedFundInformation := domain.FundInformation{}
	err := f.rep.Update(c, id, userID, teacherID, price, remark, isFirstCheck, isLastCheck, receivedAt)
	row, err := f.rep.Find(c, id)
	err = row.Scan(
		&updatedFundInformation.ID,
		&updatedFundInformation.UserID,
		&updatedFundInformation.TeacherID,
		&updatedFundInformation.Price,
		&updatedFundInformation.Remark,
		&updatedFundInformation.IsFirstCheck,
		&updatedFundInformation.IsLastCheck,
		&updatedFundInformation.ReceivedAt,
		&updatedFundInformation.CreatedAt,
		&updatedFundInformation.UpdatedAt,
	)
	if err != nil {
		return updatedFundInformation, err
	}
	return updatedFundInformation, err
}

// funcInformationの削除(delete)
func (f *fundInformationUseCase) DestroyFundInformation(c context.Context, id string) error {
	err := f.rep.Delete(c, id)
	return err
}

// fund_informations-api(GETS)
func (f *fundInformationUseCase) GetFundInformationDetails(c context.Context) ([]domain.FundInformationDetail, error) {
	fundInformationDetail := domain.FundInformationDetail{}
	var fundInformationDetails []domain.FundInformationDetail

	rows, err := f.rep.FindDetails(c)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		err := rows.Scan(
			&fundInformationDetail.FundInformation.ID,
			&fundInformationDetail.FundInformation.UserID,
			&fundInformationDetail.FundInformation.TeacherID,
			&fundInformationDetail.FundInformation.Price,
			&fundInformationDetail.FundInformation.Remark,
			&fundInformationDetail.FundInformation.IsFirstCheck,
			&fundInformationDetail.FundInformation.IsLastCheck,
			&fundInformationDetail.FundInformation.ReceivedAt,
			&fundInformationDetail.FundInformation.CreatedAt,
			&fundInformationDetail.FundInformation.UpdatedAt,
			&fundInformationDetail.User.ID,
			&fundInformationDetail.User.Name,
			&fundInformationDetail.User.BureauID,
			&fundInformationDetail.User.RoleID,
			&fundInformationDetail.User.IsDeleted,
			&fundInformationDetail.User.CreatedAt,
			&fundInformationDetail.User.UpdatedAt,
			&fundInformationDetail.Teacher.ID,
			&fundInformationDetail.Teacher.Name,
			&fundInformationDetail.Teacher.Position,
			&fundInformationDetail.Teacher.DepartmentID,
			&fundInformationDetail.Teacher.Room,
			&fundInformationDetail.Teacher.IsBlack,
			&fundInformationDetail.Teacher.Remark,
			&fundInformationDetail.Teacher.CreatedAt,
			&fundInformationDetail.Teacher.UpdatedAt,
			&fundInformationDetail.Department.ID,
			&fundInformationDetail.Department.Name,
			&fundInformationDetail.Department.CreatedAt,
			&fundInformationDetail.Department.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		fundInformationDetails = append(fundInformationDetails, fundInformationDetail)

	}
	return fundInformationDetails, nil
}

// fund_information-api(GET)
func (f *fundInformationUseCase) GetFundInformationDetailByID(c context.Context, id string) (domain.FundInformationDetail, error) {
	var fundInformationDetail domain.FundInformationDetail

	row, err := f.rep.FindDetailByID(c, id)

	err = row.Scan(
		&fundInformationDetail.FundInformation.ID,
		&fundInformationDetail.FundInformation.UserID,
		&fundInformationDetail.FundInformation.TeacherID,
		&fundInformationDetail.FundInformation.Price,
		&fundInformationDetail.FundInformation.Remark,
		&fundInformationDetail.FundInformation.IsFirstCheck,
		&fundInformationDetail.FundInformation.IsLastCheck,
		&fundInformationDetail.FundInformation.ReceivedAt,
		&fundInformationDetail.FundInformation.CreatedAt,
		&fundInformationDetail.FundInformation.UpdatedAt,
		&fundInformationDetail.User.ID,
		&fundInformationDetail.User.Name,
		&fundInformationDetail.User.BureauID,
		&fundInformationDetail.User.RoleID,
		&fundInformationDetail.User.IsDeleted,
		&fundInformationDetail.User.CreatedAt,
		&fundInformationDetail.User.UpdatedAt,
		&fundInformationDetail.Teacher.ID,
		&fundInformationDetail.Teacher.Name,
		&fundInformationDetail.Teacher.Position,
		&fundInformationDetail.Teacher.DepartmentID,
		&fundInformationDetail.Teacher.Room,
		&fundInformationDetail.Teacher.IsBlack,
		&fundInformationDetail.Teacher.Remark,
		&fundInformationDetail.Teacher.CreatedAt,
		&fundInformationDetail.Teacher.UpdatedAt,
		&fundInformationDetail.Department.ID,
		&fundInformationDetail.Department.Name,
		&fundInformationDetail.Department.CreatedAt,
		&fundInformationDetail.Department.UpdatedAt,
	)
	if err != nil {
		return fundInformationDetail, err
	}
	return fundInformationDetail, nil
}

//fund_informations_byyear-api(GETS)
func (f *fundInformationUseCase) GetFundInformationDetailsByPeriod(c context.Context, year string) ([]domain.FundInformationDetail, error) {
	fundInformationDetail:= domain.FundInformationDetail{}
	var fundInformationDetails []domain.FundInformationDetail

	rows, err := f.rep.AllDetailsByPeriod(c, year)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		err := rows.Scan(
		&fundInformationDetail.FundInformation.ID,
		&fundInformationDetail.FundInformation.UserID,
		&fundInformationDetail.FundInformation.TeacherID,
		&fundInformationDetail.FundInformation.Price,
		&fundInformationDetail.FundInformation.Remark,
		&fundInformationDetail.FundInformation.IsFirstCheck,
		&fundInformationDetail.FundInformation.IsLastCheck,
		&fundInformationDetail.FundInformation.ReceivedAt,
		&fundInformationDetail.FundInformation.CreatedAt,
		&fundInformationDetail.FundInformation.UpdatedAt,
		&fundInformationDetail.User.ID,
		&fundInformationDetail.User.Name,
		&fundInformationDetail.User.BureauID,
		&fundInformationDetail.User.RoleID,
		&fundInformationDetail.User.IsDeleted,
		&fundInformationDetail.User.CreatedAt,
		&fundInformationDetail.User.UpdatedAt,
		&fundInformationDetail.Teacher.ID,
		&fundInformationDetail.Teacher.Name,
		&fundInformationDetail.Teacher.Position,
		&fundInformationDetail.Teacher.DepartmentID,
		&fundInformationDetail.Teacher.Room,
		&fundInformationDetail.Teacher.IsBlack,
		&fundInformationDetail.Teacher.Remark,
		&fundInformationDetail.Teacher.CreatedAt,
		&fundInformationDetail.Teacher.UpdatedAt,
		&fundInformationDetail.Department.ID,
		&fundInformationDetail.Department.Name,
		&fundInformationDetail.Department.CreatedAt,
		&fundInformationDetail.Department.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		fundInformationDetails = append(fundInformationDetails, fundInformationDetail)
	}
	return fundInformationDetails, nil
}
