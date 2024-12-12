package test

import (
	"database/sql"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"net/url"
	"os"
	"testing"

	"github.com/NUTFes/FinanSu/api/internals/di"
	testfixtures "github.com/go-testfixtures/testfixtures/v3"
	"github.com/stretchr/testify/assert"
)

const helloMessage = "healthcheck: ok"

var (
	db       *sql.DB
	fixtures *testfixtures.Loader
)

func TestMain(m *testing.M) {
	var err error
	os.Setenv("NUTMEG_DB_USER", "finansu")
	os.Setenv("NUTMEG_DB_PASSWORD", "password")
	os.Setenv("NUTMEG_DB_HOST", "nutfes-finansu-db")
	os.Setenv("NUTMEG_DB_PORT", "3306")
	os.Setenv("NUTMEG_DB_NAME", "finansu_test_db")

	// テスト前処理
	db, err = sql.Open("mysql", "finansu:password@tcp(nutfes-finansu-db:3306)/finansu_test_db")
	if err != nil {
		fmt.Println(err)
	}
	defer db.Close()

	fixtures, err = testfixtures.New(
		testfixtures.Database(db),          // You database connection
		testfixtures.Dialect("mysql"),      // Available: "postgresql", "timescaledb", "mysql", "mariadb", "sqlite" and "sqlserver"
		testfixtures.Directory("fixtures"), // The directory containing the YAML files
	)
	if err != nil {
		fmt.Printf("Error creating fixtures: %v\n", err)
		return
	}

	// テスト実行
	code := m.Run()

	// テスト後処理
	// db.Exec("DELETE FROM users")

	if err != nil {
		fmt.Print(err.Error())
	}

	os.Exit(code)
}

func prepareTestDatabase(t *testing.T) {
	fmt.Println(fixtures)
	if err := fixtures.Load(); err != nil {
		fmt.Println(err)
	}
}

func TestHelloHandler(t *testing.T) {
	_, router := di.InitializeServer()

	testServer := httptest.NewServer(router) // サーバを立てる
	t.Cleanup(func() {
		testServer.Close()
	})

	r, err := http.Get(testServer.URL + "/")
	if err != nil {
		t.Errorf("Error making request: %s", err)
		return
	}

	defer r.Body.Close()

	body, err := io.ReadAll(r.Body)
	if err != nil {
		t.Errorf("Error reading response body: %s", err)
		return
	}

	assert.Equal(t, http.StatusOK, r.StatusCode)
	assert.Equal(t, helloMessage, string(body))
}

func TestGetUserHandler(t *testing.T) {
	prepareTestDatabase(t)

	_, router := di.InitializeServer()

	testServer := httptest.NewServer(router) // サーバを立てる
	t.Cleanup(func() {
		testServer.Close()
	})

	r, err := http.Get(testServer.URL + "/users")
	if err != nil {
		t.Errorf("Error making request: %s", err)
		return
	}

	defer r.Body.Close()

	body, err := io.ReadAll(r.Body)
	if err != nil {
		t.Errorf("Error reading response body: %s", err)
		return
	}

	assert.Equal(t, http.StatusOK, r.StatusCode)
	assert.Contains(t, string(body), "テスト太郎")
}

func TestAddUserHandler(t *testing.T) {
	prepareTestDatabase(t)
	_, router := di.InitializeServer()

	testServer := httptest.NewServer(router)
	t.Cleanup(func() {
		testServer.Close()
	})

	u, err := url.Parse(testServer.URL + "/users")
	if err != nil {
		return
	}

	// クエリパラメータを追加
	q := u.Query()
	q.Set("name", "窪坂駿吾")
	q.Set("bureau_id", "1")
	q.Set("role_id", "1")
	u.RawQuery = q.Encode()

	fmt.Println(u.String())

	r, err := http.Post(u.String(), "application/json", nil)
	if err != nil {
		t.Errorf("Error making request: %s", err)
		return
	}

	defer r.Body.Close()

	body, err := io.ReadAll(r.Body)
	if err != nil {
		t.Errorf("Error reading response body: %s", err)
		return
	}

	assert.Equal(t, http.StatusCreated, r.StatusCode)
	assert.Contains(t, string(body), "窪坂駿吾")
}
