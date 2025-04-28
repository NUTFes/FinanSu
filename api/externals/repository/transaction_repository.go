package repository

import (
	"context"
	"database/sql"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/NUTFes/FinanSu/api/externals/repository/abstract"
)

type transactionRepository struct {
	client db.Client
	crud   abstract.Crud
}

type TransactionRepository interface {
	StartTransaction(context.Context) (*sql.Tx, error)
	RollBack(context.Context, *sql.Tx) error
	Commit(context.Context, *sql.Tx) error
}

func NewTransactionRepository(c db.Client, ac abstract.Crud) TransactionRepository {
	return &transactionRepository{c, ac}
}

func (tr *transactionRepository) StartTransaction(c context.Context) (*sql.Tx, error) {
	return tr.crud.StartTransaction(c)
}

func (tr *transactionRepository) RollBack(c context.Context, tx *sql.Tx) error {
	return tr.crud.RollBack(c, tx)
}

func (tr *transactionRepository) Commit(c context.Context, tx *sql.Tx) error {
	return tr.crud.Commit(c, tx)
}
