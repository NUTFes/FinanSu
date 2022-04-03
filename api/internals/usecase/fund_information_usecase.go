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
	CreateFundInformation(context.Context, string, string, string, string, string, string) error
	UpdateFundInformation(context.Context, string, string, string, string, string, string, string) error
	DestroyFundInformation(context.Context, string) error
	GetFundInforWithUserAndTeach(context.Context) ([]domain.FundInforWithUserAndTeacher, error)
}

func NewFundInformationUseCase(rep rep.FundInformationRepository) FundInformationUseCase {
	return &fundInformationUseCase{rep}
}

//FundInformationsの取得(Get)
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

//FundInfomationの取得(Get)
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

//FundInfomationの作成(Create)
func (f *fundInformationUseCase) CreateFundInformation(
	c context.Context,
	userID string,
	teacherID string,
	price string,
	remark string,
	isFirstCheck string,
	isLastCheck string,
) error {
	err := f.rep.Create(c, userID, teacherID, price, remark, isFirstCheck, isLastCheck)
	return err
}

//FundInformationの修正(Update)
func (f *fundInformationUseCase) UpdateFundInformation(
	c context.Context,
	id string,
	userID string,
	teacherID string,
	price string,
	remark string,
	isFirstCheck string,
	isLastCheck string,
) error {
	err := f.rep.Update(c, id, userID, teacherID, price, remark, isFirstCheck, isLastCheck)
	return err
}

//funcInformationの削除(delete)
func (f *fundInformationUseCase) DestroyFundInformation(c context.Context, id string) error {
	err := f.rep.Delete(c, id)
	return err
}

//teachernameとusernameを含めたfund_informationsの取得(GETS)
func (f *fundInformationUseCase) GetFundInforWithUserAndTeach(c context.Context) ([]domain.FundInforWithUserAndTeacher, error) {
	fundinforuserandteacher := domain.FundInforWithUserAndTeacher{}
	var fundinforuserandteachers []domain.FundInforWithUserAndTeacher

	rows ,err := f.rep.AllWithUAndT(c)
	if err != nil {
		return nil, err
	}
	for rows.Next(){
		err := rows.Scan(
			&fundinforuserandteacher.ID,
			&fundinforuserandteacher.UName,
			&fundinforuserandteacher.TName,
			&fundinforuserandteacher.Position,
			&fundinforuserandteacher.DName,
			&fundinforuserandteacher.Room,
			&fundinforuserandteacher.IsBlack,
			&fundinforuserandteacher.TRemark,
			&fundinforuserandteacher.Price,
			&fundinforuserandteacher.FRemark,
			&fundinforuserandteacher.IsFirstCheck,
			&fundinforuserandteacher.IsLastCheck,
			&fundinforuserandteacher.CreatedAt,
		  &fundinforuserandteacher.UpdatedAt,
		) 
		if err != nil {
			return nil,err
		}
		fundinforuserandteachers = append(fundinforuserandteachers, fundinforuserandteacher)
	}
	return fundinforuserandteachers, nil
}
