package test

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"

	"github.com/NUTFes/FinanSu/api/internals/di"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func insertMailAuthAndSession(t *testing.T, userID int, email string, accessToken string) int64 {
	t.Helper()

	result, err := db.Exec("INSERT INTO mail_auth (email, password, user_id) VALUES (?, ?, ?)", email, "hashed-password", userID)
	require.NoError(t, err)

	authID, err := result.LastInsertId()
	require.NoError(t, err)

	_, err = db.Exec("INSERT INTO session (auth_id, user_id, access_token) VALUES (?, ?, ?)", authID, userID, accessToken)
	require.NoError(t, err)

	return authID
}

func nullableEmailByUserID(t *testing.T, userID int) sql.NullString {
	t.Helper()

	var email sql.NullString
	err := db.QueryRow("SELECT email FROM mail_auth WHERE user_id = ?", userID).Scan(&email)
	require.NoError(t, err)
	return email
}

func TestDestroyUserClearsMailAuthAndSessionInTransaction(t *testing.T) {
	prepareTestDatabase(t)

	serverComponents, err := di.InitializeServer()
	require.NoError(t, err)

	testServer := httptest.NewServer(serverComponents.Echo)
	t.Cleanup(func() {
		testServer.Close()
		serverComponents.Client.CloseDB()
	})

	userID := 1
	insertMailAuthAndSession(t, userID, "delete-user@example.com", "delete-user-token")

	req, err := http.NewRequest(http.MethodDelete, testServer.URL+"/users/"+strconv.Itoa(userID), nil)
	require.NoError(t, err)

	res, err := http.DefaultClient.Do(req)
	require.NoError(t, err)
	defer res.Body.Close()

	assert.Equal(t, http.StatusOK, res.StatusCode)
	assert.Equal(t, 1, countRows(t, "SELECT COUNT(*) FROM users WHERE id = ? AND is_deleted IS TRUE", userID))
	assert.False(t, nullableEmailByUserID(t, userID).Valid)
	assert.Equal(t, 0, countRows(t, "SELECT COUNT(*) FROM session WHERE user_id = ?", userID))
}

func TestDestroyMultiUsersClearsMailAuthAndSessionInTransaction(t *testing.T) {
	prepareTestDatabase(t)

	serverComponents, err := di.InitializeServer()
	require.NoError(t, err)

	testServer := httptest.NewServer(serverComponents.Echo)
	t.Cleanup(func() {
		testServer.Close()
		serverComponents.Client.CloseDB()
	})

	userIDs := []int{1, 2}
	insertMailAuthAndSession(t, userIDs[0], "delete-user-1@example.com", "delete-user-token-1")
	insertMailAuthAndSession(t, userIDs[1], "delete-user-2@example.com", "delete-user-token-2")

	body, err := json.Marshal(map[string]any{"deleteIDs": userIDs})
	require.NoError(t, err)

	req, err := http.NewRequest(http.MethodDelete, testServer.URL+"/users/delete", bytes.NewReader(body))
	require.NoError(t, err)
	req.Header.Set("Content-Type", "application/json")

	res, err := http.DefaultClient.Do(req)
	require.NoError(t, err)
	defer res.Body.Close()

	assert.Equal(t, http.StatusOK, res.StatusCode)
	for _, userID := range userIDs {
		assert.Equal(t, 1, countRows(t, "SELECT COUNT(*) FROM users WHERE id = ? AND is_deleted IS TRUE", userID))
		assert.False(t, nullableEmailByUserID(t, userID).Valid)
		assert.Equal(t, 0, countRows(t, "SELECT COUNT(*) FROM session WHERE user_id = ?", userID))
	}
}
