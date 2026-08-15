package server

import (
	"net/http"
	"testing"
)

func TestIsPublicRoute(t *testing.T) {
	tests := []struct {
		name   string
		method string
		path   string
		want   bool
	}{
		{"ヘルスチェックは認証不要", http.MethodGet, "/", true},
		{"ログインは認証不要", http.MethodPost, "/mail_auth/signin", true},
		{"新規登録は認証不要", http.MethodPost, "/mail_auth/signup", true},
		{"新規登録時のユーザ作成は認証不要", http.MethodPost, "/users", true},
		{"末尾スラッシュ付きのユーザ作成も認証不要", http.MethodPost, "/users/", true},
		{"パスワード再設定リクエストは認証不要", http.MethodPost, "/password_reset/request", true},
		{"パスワード再設定は認証不要", http.MethodPost, "/password_reset/12", true},
		{"パスワード再設定トークン検証は認証不要", http.MethodPost, "/password_reset/12/valid", true},

		{"ユーザ一覧は認証が必要", http.MethodGet, "/users", false},
		{"ユーザ更新は認証が必要", http.MethodPut, "/users/1", false},
		{"ユーザ削除は認証が必要", http.MethodDelete, "/users/1", false},
		{"ログインユーザ取得は認証が必要", http.MethodGet, "/current_user", false},
		{"ログアウトは認証が必要", http.MethodDelete, "/mail_auth/signout", false},
		{"ヘルスチェック以外のメソッドは認証が必要", http.MethodPost, "/", false},
		{"パスワード再設定に似た別パスは認証が必要", http.MethodGet, "/password_resets", false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := isPublicRoute(tt.method, tt.path); got != tt.want {
				t.Errorf("isPublicRoute(%q, %q) = %v, want %v", tt.method, tt.path, got, tt.want)
			}
		})
	}
}

func TestAccessToken(t *testing.T) {
	tests := []struct {
		name    string
		headers map[string]string
		want    string
	}{
		{"Access-Token ヘッダから取得する", map[string]string{"Access-Token": "token123"}, "token123"},
		{"前後の空白を取り除く", map[string]string{"Access-Token": "  token123  "}, "token123"},
		{"Authorization: Bearer から取得する", map[string]string{"Authorization": "Bearer token123"}, "token123"},
		{"bearer の大文字小文字は区別しない", map[string]string{"Authorization": "bearer token123"}, "token123"},
		{
			"Access-Token を優先する",
			map[string]string{"Access-Token": "fromHeader", "Authorization": "Bearer fromBearer"},
			"fromHeader",
		},
		{"Bearer 以外のスキームは無視する", map[string]string{"Authorization": "Basic token123"}, ""},
		{"ヘッダがない場合は空文字", map[string]string{}, ""},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req, err := http.NewRequest(http.MethodGet, "/current_user", nil)
			if err != nil {
				t.Fatalf("failed to create request: %v", err)
			}
			for key, value := range tt.headers {
				req.Header.Set(key, value)
			}
			if got := accessToken(req); got != tt.want {
				t.Errorf("accessToken() = %q, want %q", got, tt.want)
			}
		})
	}
}
