package server

import (
	"database/sql"
	"errors"
	"net/http"
	"strings"

	"github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/internals/domain"
	"github.com/labstack/echo/v4"
)

// AuthenticatedUserContextKey は domain パッケージに定義されている。
// server パッケージは handler パッケージを import しているため、ここに定数を
// 置いたままだとハンドラ側から参照した際に import 循環が発生してしまう。
const AuthenticatedUserContextKey = domain.AuthenticatedUserContextKey

// 認証不要なエンドポイント
// パスだけで判定すると `GET /users` のような保護対象まで公開してしまうため、
// メソッドとパスの組み合わせで判定する
var publicRoutes = map[string]map[string]struct{}{
	// ヘルスチェック (ロードバランサ・死活監視用)
	"/": {http.MethodGet: {}},
	// ログイン・新規登録
	"/mail_auth/signin": {http.MethodPost: {}},
	"/mail_auth/signup": {http.MethodPost: {}},
	// 新規登録では user を作成してから mail_auth/signup でセッションを発行するため、
	// ユーザ作成のみ認証不要にする
	"/users": {http.MethodPost: {}},
}

// パスワード再設定はメールのリンクから未ログイン状態でアクセスされるため、
// プレフィックス単位で認証不要にする
var publicPathPrefixes = []string{"/password_reset/"}

func SessionAuth(sessionRepository repository.SessionRepository) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			req := c.Request()
			if req.Method == http.MethodOptions || isPublicRoute(req.Method, req.URL.Path) {
				return next(c)
			}

			token := accessToken(req)
			if token == "" {
				return echo.NewHTTPError(http.StatusUnauthorized, "access token is required")
			}

			user, err := sessionRepository.FindActiveUserByAccessToken(req.Context(), token)
			if err != nil {
				if errors.Is(err, sql.ErrNoRows) {
					return echo.NewHTTPError(http.StatusUnauthorized, "invalid or expired access token")
				}
				return echo.NewHTTPError(http.StatusInternalServerError, "failed to authenticate session")
			}

			// Authorization: Bearer で送られてきた場合でも、
			// ハンドラ側の Access-Token ヘッダパラメータが解決できるようにする
			req.Header.Set("Access-Token", token)

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

func isPublicRoute(method string, path string) bool {
	if methods, ok := publicRoutes[normalizePath(path)]; ok {
		if _, ok := methods[method]; ok {
			return true
		}
	}
	for _, prefix := range publicPathPrefixes {
		if strings.HasPrefix(path, prefix) {
			return true
		}
	}
	return false
}

// 末尾のスラッシュを取り除く ("/users/" と "/users" を同一視する)
func normalizePath(path string) string {
	if len(path) > 1 {
		return strings.TrimRight(path, "/")
	}
	return path
}
