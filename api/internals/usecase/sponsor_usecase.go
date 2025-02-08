package usecase

import (
	"context"
	"encoding/csv"
	"fmt"
	"io"
	"strings"
	"unicode/utf8"

	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/internals/domain"
)

type sponsorUseCase struct {
	rep rep.SponsorRepository
}

type SponsorUseCase interface {
	GetSponsor(context.Context) ([]domain.Sponsor, error)
	GetSponsorByID(context.Context, string) (domain.Sponsor, error)
	CreateSponsor(context.Context, string, string, string, string, string) (domain.Sponsor, error)
	UpdateSponsor(context.Context, string, string, string, string, string, string) (domain.Sponsor, error)
	DestroySponsor(context.Context, string) error
	GetSponsorByPeriod(context.Context, string) ([]domain.Sponsor, error)
	CreateSponsorsByCsv(context.Context, io.Reader) ([]domain.Sponsor, error)
	GetSponsorByRowAffected(context.Context, string) ([]domain.Sponsor, error)
}

func NewSponsorUseCase(rep rep.SponsorRepository) SponsorUseCase {
	return &sponsorUseCase{rep}
}

// sponsorsの取得(Gets)
func (s *sponsorUseCase) GetSponsor(c context.Context) ([]domain.Sponsor, error) {
	sponsor := domain.Sponsor{}
	var sponsors []domain.Sponsor
	rows, err := s.rep.All(c)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		err := rows.Scan(
			&sponsor.ID,
			&sponsor.Name,
			&sponsor.Tel,
			&sponsor.Email,
			&sponsor.Address,
			&sponsor.Representative,
			&sponsor.CreatedAt,
			&sponsor.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		sponsors = append(sponsors, sponsor)
	}
	return sponsors, nil
}

// sponsorの取得(Get)
func (s *sponsorUseCase) GetSponsorByID(c context.Context, id string) (domain.Sponsor, error) {
	sponsor := domain.Sponsor{}
	row, err := s.rep.Find(c, id)
	err = row.Scan(
		&sponsor.ID,
		&sponsor.Name,
		&sponsor.Tel,
		&sponsor.Email,
		&sponsor.Address,
		&sponsor.Representative,
		&sponsor.CreatedAt,
		&sponsor.UpdatedAt,
	)
	if err != nil {
		return sponsor, err
	}
	return sponsor, nil
}

// sponsorの作成(create)
func (s *sponsorUseCase) CreateSponsor(
	c context.Context,
	Name string,
	Tel string,
	Email string,
	Address string,
	Representative string,
) (domain.Sponsor, error) {
	latastSponsor := domain.Sponsor{}
	err := s.rep.Create(c, Name, Tel, Email, Address, Representative)
	row, err := s.rep.FindLatestRecord(c)
	err = row.Scan(
		&latastSponsor.ID,
		&latastSponsor.Name,
		&latastSponsor.Tel,
		&latastSponsor.Email,
		&latastSponsor.Address,
		&latastSponsor.Representative,
		&latastSponsor.CreatedAt,
		&latastSponsor.UpdatedAt,
	)
	if err != nil {
		return latastSponsor, err
	}
	return latastSponsor, err
}

// sponsorの編集(Update)
func (s *sponsorUseCase) UpdateSponsor(
	c context.Context,
	id string,
	Name string,
	Tel string,
	Email string,
	Address string,
	Representative string,
) (domain.Sponsor, error) {
	updatedSponsor := domain.Sponsor{}
	err := s.rep.Update(c, id, Name, Tel, Email, Address, Representative)
	row, err := s.rep.Find(c, id)
	err = row.Scan(
		&updatedSponsor.ID,
		&updatedSponsor.Name,
		&updatedSponsor.Tel,
		&updatedSponsor.Email,
		&updatedSponsor.Address,
		&updatedSponsor.Representative,
		&updatedSponsor.CreatedAt,
		&updatedSponsor.UpdatedAt,
	)
	return updatedSponsor, err
}

// //sponsorの削除(delete)
func (s *sponsorUseCase) DestroySponsor(
	c context.Context,
	id string,
) error {
	err := s.rep.Delete(c, id)
	return err
}

// 年度別のsponsorsの取得(GetByPeriod)
func (s *sponsorUseCase) GetSponsorByPeriod(c context.Context, year string) ([]domain.Sponsor, error) {
	sponsor := domain.Sponsor{}
	var sponsors []domain.Sponsor
	rows, err := s.rep.AllByPeriod(c, year)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		err := rows.Scan(
			&sponsor.ID,
			&sponsor.Name,
			&sponsor.Tel,
			&sponsor.Email,
			&sponsor.Address,
			&sponsor.Representative,
			&sponsor.CreatedAt,
			&sponsor.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		sponsors = append(sponsors, sponsor)
	}
	return sponsors, nil
}

func (s *sponsorUseCase) CreateSponsorsByCsv(c context.Context, csvFile io.Reader) ([]domain.Sponsor, error) {
	sponsor := domain.Sponsor{}
	var sponsors []domain.Sponsor

	r := csv.NewReader(csvFile)
	r.TrimLeadingSpace = true
	records, err := r.ReadAll()
	if err != nil {
		return nil, err
	}

	if len(records) == 0 {
		return nil, fmt.Errorf("csvの中身が空です。")
	}

	header := []string{"Name", "Tel", "Email", "Address", "Representative"}
	records = removeBOM(records)

	for i, record := range records {
		if i == 0 {
			if !isHeaderMatch(header, record) {
				return nil, fmt.Errorf("異なるヘッダーがあります。")
			}
			continue
		}

		for j := range record {
			if isEmpty(record[j]) {
				return nil, fmt.Errorf("空のレコードがあります。")
			}
		}

		sponsor := domain.Sponsor{
			Name:           record[0],
			Tel:            record[1],
			Email:          record[2],
			Address:        record[3],
			Representative: record[4],
		}
		sponsors = append(sponsors, sponsor)
	}
	rowAffected, err := s.rep.CreateByCsv(c, sponsors)
	if err != nil {
		return nil, err
	}

	sponsors = []domain.Sponsor{}
	rows, err := s.rep.FindByRowsAffected(c, string(rowAffected))
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		err := rows.Scan(
			&sponsor.ID,
			&sponsor.Name,
			&sponsor.Tel,
			&sponsor.Email,
			&sponsor.Address,
			&sponsor.Representative,
			&sponsor.CreatedAt,
			&sponsor.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		sponsors = append(sponsors, sponsor)
	}
	return sponsors, nil
}

func (s *sponsorUseCase) GetSponsorByRowAffected(c context.Context, row string) ([]domain.Sponsor, error) {
	sponsor := domain.Sponsor{}
	var sponsors []domain.Sponsor
	rows, err := s.rep.FindByRowsAffected(c, row)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		err := rows.Scan(
			&sponsor.ID,
			&sponsor.Name,
			&sponsor.Tel,
			&sponsor.Email,
			&sponsor.Address,
			&sponsor.Representative,
			&sponsor.CreatedAt,
			&sponsor.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		sponsors = append(sponsors, sponsor)
	}
	return sponsors, nil
}

func isEmpty(s string) bool {
	return s == ""
}

func removeBOM(header [][]string) [][]string {
	for i, row := range header {
		if len(row) > 0 && strings.HasPrefix(row[0], "\uFEFF") {
			_, size := utf8.DecodeRuneInString(row[0])
			header[i][0] = row[0][size:]
		}
	}
	return header
}

func isHeaderMatch(headers []string, records []string) bool {
	for i := range headers {
		if headers[i] != records[i] {
			return false
		}
	}
	return true
}
