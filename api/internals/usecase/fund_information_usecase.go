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
	CreateFundInformation(context.Context, string, string, string, string, string, string) (domain.FundInformation, error)
	UpdateFundInformation(context.Context, string, string, string, string, string, string, string) (domain.FundInformation, error)
	DestroyFundInformation(context.Context, string) error
	GetFundInformationDetails(context.Context) ([]domain.FundInformationDetail, error)
	GetFundInformationDetailByID(context.Context, string) (domain.FundInformationDetail, error)
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
) (domain.FundInformation, error) {
	latastFundInformation := domain.FundInformation{}
	err := f.rep.Create(c, userID, teacherID, price, remark, isFirstCheck, isLastCheck)
	row, err := f.rep.FindLatestRecord(c)
	err = row.Scan(
		&latastFundInformation.ID,
		&latastFundInformation.UserID,
		&latastFundInformation.TeacherID,
		&latastFundInformation.Price,
		&latastFundInformation.Remark,
		&latastFundInformation.IsFirstCheck,
		&latastFundInformation.IsLastCheck,
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
) (domain.FundInformation, error) {
	updatedFundInformation := domain.FundInformation{}
	err := f.rep.Update(c, id, userID, teacherID, price, remark, isFirstCheck, isLastCheck)
	row, err := f.rep.Find(c, id)
	err = row.Scan(
		&updatedFundInformation.ID,
		&updatedFundInformation.UserID,
		&updatedFundInformation.TeacherID,
		&updatedFundInformation.Price,
		&updatedFundInformation.Remark,
		&updatedFundInformation.IsFirstCheck,
		&updatedFundInformation.IsLastCheck,
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
	FundInformationDetail := domain.FundInformationDetail{}
	var FundInformationDetails []domain.FundInformationDetail

	rows, err := f.rep.FindDetails(c)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		err := rows.Scan(
			&FundInformationDetail.FundInformation.ID,
			&FundInformationDetail.FundInformation.UserID,
			&FundInformationDetail.FundInformation.TeacherID,
			&FundInformationDetail.FundInformation.Price,
			&FundInformationDetail.FundInformation.Remark,
			&FundInformationDetail.FundInformation.IsFirstCheck,
			&FundInformationDetail.FundInformation.IsLastCheck,
			&FundInformationDetail.FundInformation.CreatedAt,
			&FundInformationDetail.FundInformation.UpdatedAt,
			&FundInformationDetail.User.ID,
			&FundInformationDetail.User.Name,
			&FundInformationDetail.User.BureauID,
			&FundInformationDetail.User.RoleID,
			&FundInformationDetail.User.CreatedAt,
			&FundInformationDetail.User.UpdatedAt,
			&FundInformationDetail.Teacher.ID,
			&FundInformationDetail.Teacher.Name,
			&FundInformationDetail.Teacher.Position,
			&FundInformationDetail.Teacher.DepartmentID,
			&FundInformationDetail.Teacher.Room,
			&FundInformationDetail.Teacher.IsBlack,
			&FundInformationDetail.Teacher.Remark,
			&FundInformationDetail.Teacher.CreatedAt,
			&FundInformationDetail.Teacher.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		FundInformationDetails = append(FundInformationDetails, FundInformationDetail)
	}
	return FundInformationDetails, nil
}

// fund_information-api(GET)
func (f *fundInformationUseCase) GetFundInformationDetailByID(c context.Context, id string) (domain.FundInformationDetail, error) {
	var FundInformationDetail domain.FundInformationDetail

	row, err := f.rep.FindDetailByID(c, id)

	err = row.Scan(
		&FundInformationDetail.FundInformation.ID,
		&FundInformationDetail.FundInformation.UserID,
		&FundInformationDetail.FundInformation.TeacherID,
		&FundInformationDetail.FundInformation.Price,
		&FundInformationDetail.FundInformation.Remark,
		&FundInformationDetail.FundInformation.IsFirstCheck,
		&FundInformationDetail.FundInformation.IsLastCheck,
		&FundInformationDetail.FundInformation.CreatedAt,
		&FundInformationDetail.FundInformation.UpdatedAt,
		&FundInformationDetail.User.ID,
		&FundInformationDetail.User.Name,
		&FundInformationDetail.User.BureauID,
		&FundInformationDetail.User.RoleID,
		&FundInformationDetail.User.CreatedAt,
		&FundInformationDetail.User.UpdatedAt,
		&FundInformationDetail.Teacher.ID,
		&FundInformationDetail.Teacher.Name,
		&FundInformationDetail.Teacher.Position,
		&FundInformationDetail.Teacher.DepartmentID,
		&FundInformationDetail.Teacher.Room,
		&FundInformationDetail.Teacher.IsBlack,
		&FundInformationDetail.Teacher.Remark,
		&FundInformationDetail.Teacher.CreatedAt,
		&FundInformationDetail.Teacher.UpdatedAt,
	)
	if err != nil {
		return FundInformationDetail, err
	}
	return FundInformationDetail, nil
}
