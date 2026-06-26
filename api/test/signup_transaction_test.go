package test

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/NUTFes/FinanSu/api/internals/di"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

type signupResponse struct {
	AccessToken string `json:"accessToken"`
	UserID      int    `json:"userID"`
}

func postSignup(t *testing.T, baseURL string, values map[string]any) *http.Response {
	t.Helper()

	body, err := json.Marshal(values)
	require.NoError(t, err)

	r, err := http.Post(baseURL+"/mail_auth/signup", "application/json", bytes.NewReader(body))
	require.NoError(t, err)
	return r
}

func countRows(t *testing.T, query string, args ...any) int {
	t.Helper()

	var count int
	err := db.QueryRow(query, args...).Scan(&count)
	require.NoError(t, err)
	return count
}

// 正常系: サインアップ時に users、mail_auth、session が作成され、発行されたアクセストークンで current_user を取得できることを確認する
func TestSignupCreatesUserMailAuthSessionAndCurrentUser(t *testing.T) {
	prepareTestDatabase(t)

	serverComponents, err := di.InitializeServer()
	require.NoError(t, err)

	testServer := httptest.NewServer(serverComponents.Echo)
	t.Cleanup(func() {
		testServer.Close()
		serverComponents.Client.CloseDB()
	})

	email := "signup-success@example.com"
	name := "Signup Success User"
	r := postSignup(t, testServer.URL, map[string]any{
		"email":     email,
		"password":  "password123",
		"name":      name,
		"bureau_id": 1,
		"role_id":   1,
	})
	defer r.Body.Close()

	body, err := io.ReadAll(r.Body)
	require.NoError(t, err)

	assert.Equal(t, http.StatusOK, r.StatusCode)

	var res signupResponse
	require.NoError(t, json.Unmarshal(body, &res))
	require.NotEmpty(t, res.AccessToken)
	require.NotZero(t, res.UserID)

	assert.Equal(t, 1, countRows(t, "SELECT COUNT(*) FROM users WHERE id = ? AND name = ? AND is_deleted IS FALSE", res.UserID, name))
	assert.Equal(t, 1, countRows(t, "SELECT COUNT(*) FROM mail_auth WHERE email = ? AND user_id = ?", email, res.UserID))
	assert.Equal(t, 1, countRows(t, "SELECT COUNT(*) FROM session WHERE access_token = ? AND user_id = ?", res.AccessToken, res.UserID))

	currentUserURL := testServer.URL + "/current_user"
	req, err := http.NewRequest(http.MethodGet, currentUserURL, nil)
	require.NoError(t, err)
	req.Header.Set("access-token", res.AccessToken)

	currentUserRes, err := http.DefaultClient.Do(req)
	require.NoError(t, err)
	defer currentUserRes.Body.Close()

	assert.Equal(t, http.StatusOK, currentUserRes.StatusCode)
}

// 異常系: mail_auth の作成に失敗した場合、同一トランザクション内で作成した users がロールバックされることを確認する
func TestSignupRollsBackUserWhenMailAuthCreateFails(t *testing.T) {
	prepareTestDatabase(t)

	serverComponents, err := di.InitializeServer()
	require.NoError(t, err)

	testServer := httptest.NewServer(serverComponents.Echo)
	t.Cleanup(func() {
		testServer.Close()
		serverComponents.Client.CloseDB()
	})

	email := "signup-duplicate@example.com"
	_, err = db.Exec("INSERT INTO mail_auth (email, password, user_id) VALUES (?, ?, ?)", email, "hashed-password", 1)
	require.NoError(t, err)

	name := "Rollback Target User"
	r := postSignup(t, testServer.URL, map[string]any{
		"email":     email,
		"password":  "password123",
		"name":      name,
		"bureau_id": 1,
		"role_id":   1,
	})
	defer r.Body.Close()

	assert.NotEqual(t, http.StatusOK, r.StatusCode)
	assert.Equal(t, 0, countRows(t, "SELECT COUNT(*) FROM users WHERE name = ?", name))
	assert.Equal(t, 1, countRows(t, "SELECT COUNT(*) FROM mail_auth WHERE email = ?", email))
}

// 異常系: 必須項目が不足しているリクエストでは BadRequest になり、users、mail_auth、session が作成されないことを確認する
func TestSignupReturnsBadRequestWhenRequiredBodyFieldsAreMissing(t *testing.T) {
	prepareTestDatabase(t)

	serverComponents, err := di.InitializeServer()
	require.NoError(t, err)

	testServer := httptest.NewServer(serverComponents.Echo)
	t.Cleanup(func() {
		testServer.Close()
		serverComponents.Client.CloseDB()
	})

	email := "signup-missing-fields@example.com"
	beforeUsers := countRows(t, "SELECT COUNT(*) FROM users")
	r := postSignup(t, testServer.URL, map[string]any{
		"email":    email,
		"password": "password123",
		"role_id":  1,
	})
	defer r.Body.Close()

	assert.Equal(t, http.StatusBadRequest, r.StatusCode)
	assert.Equal(t, beforeUsers, countRows(t, "SELECT COUNT(*) FROM users"))
	assert.Equal(t, 0, countRows(t, "SELECT COUNT(*) FROM mail_auth WHERE email = ?", email))
	assert.Equal(t, 0, countRows(t, "SELECT COUNT(*) FROM session"))
}

// 異常系: OpenAPI スキーマに違反する値では BadRequest になり、関連レコードが作成されないことを確認する
func TestSignupReturnsBadRequestWhenBodyViolatesOpenAPISchema(t *testing.T) {
	prepareTestDatabase(t)

	serverComponents, err := di.InitializeServer()
	require.NoError(t, err)

	testServer := httptest.NewServer(serverComponents.Echo)
	t.Cleanup(func() {
		testServer.Close()
		serverComponents.Client.CloseDB()
	})

	tests := []struct {
		name   string
		email  string
		values map[string]any
	}{
		{
			// name が空文字の場合にバリデーションエラーになることを確認する
			name:  "empty name",
			email: "signup-empty-name@example.com",
			values: map[string]any{
				"email":     "signup-empty-name@example.com",
				"password":  "password123",
				"name":      "",
				"bureau_id": 1,
				"role_id":   1,
			},
		},
		{
			// bureau_id が 0 の場合にバリデーションエラーになることを確認する
			name:  "zero bureau id",
			email: "signup-zero-bureau@example.com",
			values: map[string]any{
				"email":     "signup-zero-bureau@example.com",
				"password":  "password123",
				"name":      "Zero Bureau User",
				"bureau_id": 0,
				"role_id":   1,
			},
		},
		{
			// role_id が 0 の場合にバリデーションエラーになることを確認する
			name:  "zero role id",
			email: "signup-zero-role@example.com",
			values: map[string]any{
				"email":     "signup-zero-role@example.com",
				"password":  "password123",
				"name":      "Zero Role User",
				"bureau_id": 1,
				"role_id":   0,
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			beforeUsers := countRows(t, "SELECT COUNT(*) FROM users")
			r := postSignup(t, testServer.URL, tt.values)
			defer r.Body.Close()

			assert.Equal(t, http.StatusBadRequest, r.StatusCode)
			assert.Equal(t, beforeUsers, countRows(t, "SELECT COUNT(*) FROM users"))
			assert.Equal(t, 0, countRows(t, "SELECT COUNT(*) FROM mail_auth WHERE email = ?", tt.email))
			assert.Equal(t, 0, countRows(t, "SELECT COUNT(*) FROM session"))
		})
	}
}
