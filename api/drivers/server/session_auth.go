package server

import (
	"database/sql"
	"net/http"
	"strings"

	"github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/labstack/echo/v4"
)

const AuthenticatedUserContextKey = "authenticatedUser"

var publicPaths = map[string]struct{}{
	"/mail_auth/signin":       {},
	"/mail_auth/signup":       {},
	"/password_reset/request": {},
}

func SessionAuth(sessionRepository repository.SessionRepository) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			if c.Request().Method == http.MethodOptions || isPublicPath(c.Request().URL.Path) {
				return next(c)
			}

			token := accessToken(c.Request())
			if token == "" {
				return echo.NewHTTPError(http.StatusUnauthorized, "access token is required")
			}

			user, err := sessionRepository.FindActiveUserByAccessToken(c.Request().Context(), token)
			if err != nil {
				if err == sql.ErrNoRows {
					return echo.NewHTTPError(http.StatusUnauthorized, "invalid access token")
				}
				return echo.NewHTTPError(http.StatusInternalServerError, "failed to authenticate session")
			}

			c.Set(AuthenticatedUserContextKey, user)
			return next(c)
		}
	}
}

func accessToken(r *http.Request) string {
	if token := strings.TrimSpace(r.Header.Get("Access-Token")); token != "" {
		return token
	}
	const bearer = "Bearer "
	authorization := strings.TrimSpace(r.Header.Get("Authorization"))
	if len(authorization) > len(bearer) && strings.EqualFold(authorization[:len(bearer)], bearer) {
		return strings.TrimSpace(authorization[len(bearer):])
	}
	return ""
}

func isPublicPath(path string) bool {
	if _, ok := publicPaths[path]; ok {
		return true
	}
	return strings.HasPrefix(path, "/password_reset/")
}
