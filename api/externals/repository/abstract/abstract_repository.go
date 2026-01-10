package abstract

import (
	"context"
	"database/sql"
	"fmt"
	"strconv"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/pkg/errors"
)

type abstractRepository struct {
	client db.Client
}

type Crud interface {
	Read(context.Context, string) (*sql.Rows, error)
	Prepare(context.Context, string) (*sql.Stmt, error)
	ReadByID(context.Context, string) (*sql.Row, error)
	UpdateDB(context.Context, string) error
	UpdateAndReturnRows(context.Context, string) (string, error)
	StartTransaction(context.Context) (*sql.Tx, error)
	TransactionExec(context.Context, *sql.Tx, string) error
	TransactionReadByID(context.Context, *sql.Tx, string) (*sql.Row, error)
	Commit(context.Context, *sql.Tx) error
	RollBack(context.Context, *sql.Tx) error
}

func NewCrud(client db.Client) Crud {
	return &abstractRepository{client}
}

func (a abstractRepository) Read(ctx context.Context, query string) (*sql.Rows, error) {
	rows, err := a.client.DB().QueryContext(ctx, query)
	fmt.Printf("\x1b[36m%s\n", err)
	if err != nil {
		return nil, errors.Wrapf(err, "cannot connect SQL")
	}
	fmt.Printf("\x1b[36m%s\n", query)
	return rows, nil
}

func (a abstractRepository) Prepare(ctx context.Context, query string) (*sql.Stmt, error) {
	fmt.Printf("\x1b[36m%s\n", query)
	return a.client.DB().Prepare(query)
}

func (a abstractRepository) ReadByID(ctx context.Context, query string) (*sql.Row, error) {
	row := a.client.DB().QueryRowContext(ctx, query)
	fmt.Printf("\x1b[36m%s\n", query)
	return row, nil
}

func (a abstractRepository) UpdateDB(ctx context.Context, query string) error {
	_, err := a.client.DB().ExecContext(ctx, query)
	if err != nil {
		return err
	}
	fmt.Printf("\x1b[36m%s\n", query)
	return err
}

func (a abstractRepository) UpdateAndReturnRows(ctx context.Context, query string) (string, error) {
	rows, err := a.client.DB().ExecContext(ctx, query)
	if err != nil {
		return "", err
	}
	count, err := rows.RowsAffected()
	if err != nil {
		return "", err
	}
	countStr := strconv.FormatInt(count, 10)
	return countStr, err
}

func (a abstractRepository) StartTransaction(ctx context.Context) (*sql.Tx, error) {
	fmt.Printf("\x1b[36m%s\n", "TransactionStart")
	return a.client.DB().BeginTx(ctx, nil)
}

func (a abstractRepository) TransactionExec(ctx context.Context, tx *sql.Tx, query string) error {
	fmt.Printf("\x1b[36m%s\n", "TransactionExec")
	_, err := tx.ExecContext(ctx, query)
	fmt.Printf("\x1b[36m%s\n", query)
	return err
}

func (a abstractRepository) TransactionReadByID(ctx context.Context, tx *sql.Tx, query string) (*sql.Row, error) {
	fmt.Printf("\x1b[36m%s\n", "TransactionReadByID")
	row := tx.QueryRowContext(ctx, query)
	fmt.Printf("\x1b[36m%s\n", query)
	return row, nil
}

func (a abstractRepository) Commit(ctx context.Context, tx *sql.Tx) error {
	fmt.Printf("\x1b[36m%s\n", "Commit")
	return tx.Commit()
}

func (a abstractRepository) RollBack(ctx context.Context, tx *sql.Tx) error {
	fmt.Printf("\x1b[36m%s\n", "RollBack")
	return tx.Rollback()
}
