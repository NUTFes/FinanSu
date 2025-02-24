package handler

import (
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
)

// router.POST(baseURL+"/upload_file", wrapper.PostUploadFile)
func (h *Handler) PostUploadFile(c echo.Context) error {
	file, err := c.FormFile("file")
	if err != nil {
		return c.String(http.StatusBadRequest, "file not found")
	}

	if err := h.objectUploadUseCase.UploadFile(c.Request().Context(), file); err != nil {
		log.Println(err)
		return c.String(http.StatusInternalServerError, "upload failed")
	}

	return c.String(http.StatusOK, "upload success")
}
