package controller

import (
	"log"
	"net/http"

	"github.com/NUTFes/FinanSu/api/internals/usecase"
	"github.com/labstack/echo/v4"
)

type objectUploadController struct {
	u usecase.ObjectUploadUseCase
}

type ObjectUploadController interface {
	UploadObject(echo.Context) error
}

func NewObjectUploadController(u usecase.ObjectUploadUseCase) ObjectUploadController {
	return &objectUploadController{u}
}

func (oc objectUploadController) UploadObject(c echo.Context) error {
	file, err := c.FormFile("file")
	if err != nil {
		return c.String(http.StatusBadRequest, "file not found")
	}

	if err := oc.u.UploadFile(c.Request().Context(), file); err != nil {
		log.Println(err)
		return c.String(http.StatusInternalServerError, "upload failed")
	}

	return c.String(http.StatusOK, "upload success")
}
