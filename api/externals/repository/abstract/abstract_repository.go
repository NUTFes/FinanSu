package abstract

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/NUTFes/FinanSu/api/drivers/db"
	"github.com/pkg/errors"
)

type abstractRepository struct {
	client db.Client
}

type Crud interface {
	Read(context.Context, string) (*sql.Rows, error)
}

func NewCrud(client db.Client) Crud {
	return &abstractRepository{client}
}

func (a abstractRepository) Read(ctx context.Context, query string) (*sql.Rows, error) {
	rows, err := a.client.DB().QueryContext(ctx, query)
	if err != nil {
		return nil, errors.Wrapf(err, "cannot connect SQL")
	}
	fmt.Printf("\x1b[36m%s\n", query)
	return rows, nil
}
