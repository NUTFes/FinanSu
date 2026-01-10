package controller

import (
	"encoding/csv"
	"fmt"
	"net/http"
	"strconv"

	"github.com/NUTFes/FinanSu/api/generated"
	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/labstack/echo/v4"
	"golang.org/x/text/encoding/japanese"
	"golang.org/x/text/transform"
)

type incomeExpenditureManagementController struct {
	u usecase.IncomeExpenditureManagementUseCase
}

type IncomeExpenditureManagementController interface {
	IndexIncomeExpenditureManagements(echo.Context) error
	PutIncomeExpenditureManagementCheck(echo.Context) error
	DownloadIncomeExpenditureManagementCSV(echo.Context) error
}

func NewIncomeExpenditureManagementController(u usecase.IncomeExpenditureManagementUseCase) IncomeExpenditureManagementController {
	return &incomeExpenditureManagementController{u}
}

// Index
func (i *incomeExpenditureManagementController) IndexIncomeExpenditureManagements(c echo.Context) error {
	ctx := c.Request().Context()
	year := c.QueryParam("year")

	incomeExpenditureManagements, err := i.u.IndexIncomeExpenditureManagements(ctx, year)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, incomeExpenditureManagements)
}

// Put
func (i *incomeExpenditureManagementController) PutIncomeExpenditureManagementCheck(c echo.Context) error {
	ctx := c.Request().Context()
	id := c.Param("id")
	var body generated.PutIncomeExpenditureManagementsCheckIdJSONBody
	if err := c.Bind(&body); err != nil {
		return err
	}

	if err := i.u.PutIncomeExpenditureManagementCheck(ctx, id, body.IsChecked); err != nil {
		return err
	}

	return c.JSON(http.StatusOK, "ok")
}

type (
	PutIncomeExpenditureManagementsCheckIdJSONBody = generated.PutIncomeExpenditureManagementsCheckIdJSONBody
)

func (i *incomeExpenditureManagementController) DownloadIncomeExpenditureManagementCSV(c echo.Context) error {
	ctx := c.Request().Context()
	year := c.QueryParam("year")

	details, err := i.u.IndexIncomeExpenditureManagements(ctx, year)
	if err != nil {
		return err
	}

	records := make([][]string, 0, len(details.IncomeExpenditureManagements)+1)
	records = append(records, []string{"日付", "局名 or 収入内容", "購入物品名 or 会社名", "受取方法", "金額", "残高", "チェック"})
	for _, d := range details.IncomeExpenditureManagements {
		detail := ""
		if d.Detail != nil {
			detail = *d.Detail
		}
		receive := ""
		if d.ReceiveOption != nil {
			receive = *d.ReceiveOption
		}
		checked := "未"
		if d.IsChecked {
			checked = "済"
		}
		records = append(records, []string{
			d.Date,
			d.Content,
			detail,
			receive,
			strconv.Itoa(d.Amount),
			strconv.Itoa(d.CurrentBalance),
			checked,
		})
	}

	w := c.Response().Writer
	fileName := fmt.Sprintf("income_expenditure_management_%s.csv", year)
	attachment := fmt.Sprintf(`attachment; filename="%s"`, fileName)
	w.Header().Set("Content-Type", "text/csv; charset=Shift_JIS")
	w.Header().Set("Content-Disposition", attachment)

	return makeIncomeExpenditureManagementCSV(w, records)
}

func makeIncomeExpenditureManagementCSV(writer http.ResponseWriter, records [][]string) error {
	encoder := japanese.ShiftJIS.NewEncoder()
	shiftJISWriter := transform.NewWriter(writer, encoder)
	csvWriter := csv.NewWriter(shiftJISWriter)

	for _, record := range records {
		if err := csvWriter.Write(record); err != nil {
			http.Error(writer, "CSVの書き込み中にエラーが発生しました", http.StatusInternalServerError)
			return err
		}
	}
	csvWriter.Flush()
	if err := csvWriter.Error(); err != nil {
		http.Error(writer, "CSVのフラッシュ中にエラーが発生しました", http.StatusInternalServerError)
		return err
	}
	return nil
}
