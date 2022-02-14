package server

import (
	"fmt"
	"github.com/labstack/echo/v4"
	"reflect"
)

type Server struct {
}

func RunServer() {
	e := echo.New()
	fmt.Println(reflect.TypeOf(e))
}
