package repository

import (
	goqu "github.com/doug-martin/goqu/v9"
	_ "github.com/doug-martin/goqu/v9/dialect/mysql"
)

var dialect = goqu.Dialect("mysql")
