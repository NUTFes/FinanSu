package test

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/http/httptest"
	"net/url"
	"os"
	"testing"

	"github.com/NUTFes/FinanSu/api/generated"
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
	if err = os.Setenv("NUTMEG_DB_USER", "finansu"); err != nil {
		log.Fatal(err)
	}
	if err = os.Setenv("NUTMEG_DB_PASSWORD", "password"); err != nil {
		log.Fatal(err)
	}
	if err = os.Setenv("NUTMEG_DB_HOST", "nutfes-finansu-db"); err != nil {
		log.Fatal(err)
	}
	if err = os.Setenv("NUTMEG_DB_PORT", "3306"); err != nil {
		log.Fatal(err)
	}
	if err = os.Setenv("NUTMEG_DB_NAME", "finansu_test_db"); err != nil {
		log.Fatal(err)
	}
	if err = os.Setenv("MINIO_ENDPOINT", "minio:9000"); err != nil {
		log.Fatal(err)
	}
	if err = os.Setenv("MINIO_ACCESS_KEY", "user"); err != nil {
		log.Fatal(err)
	}
	if err = os.Setenv("MINIO_SECRET_KEY", "password"); err != nil {
		log.Fatal(err)
	}
	if err = os.Setenv("MINIO_USE_SSL", "false"); err != nil {
		log.Fatal(err)
	}

	// テスト前処理
	db, err = sql.Open("mysql", "finansu:password@tcp(nutfes-finansu-db:3306)/finansu_test_db")
	if err != nil {
		fmt.Println(err)
	}
	defer func() {
		if err := db.Close(); err != nil {
			log.Println(err)
		}
	}()

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

	os.Exit(code)
}

func prepareTestDatabase(t *testing.T) {
	fmt.Println(fixtures)
	if err := fixtures.Load(); err != nil {
		fmt.Println(err)
	}
}

func TestHelloHandler(t *testing.T) {
	serverComponents, err := di.InitializeServer()
	if err != nil {
		t.Errorf("Error initializing server: %s", err)
		return
	}

	testServer := httptest.NewServer(serverComponents.Echo) // サーバを立てる
	t.Cleanup(func() {
		testServer.Close()
		serverComponents.Client.CloseDB()
	})

	r, err := http.Get(testServer.URL + "/")
	if err != nil {
		t.Errorf("Error making request: %s", err)
		return
	}

	defer func() {
		if err := r.Body.Close(); err != nil {
			t.Errorf("Error closing response body: %s", err)
		}
	}()

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

	serverComponents, err := di.InitializeServer()
	if err != nil {
		t.Errorf("Error initializing server: %s", err)
		return
	}

	testServer := httptest.NewServer(serverComponents.Echo) // サーバを立てる
	t.Cleanup(func() {
		testServer.Close()
		serverComponents.Client.CloseDB()
	})

	r, err := http.Get(testServer.URL + "/users")
	if err != nil {
		t.Errorf("Error making request: %s", err)
		return
	}

	defer func() {
		if err := r.Body.Close(); err != nil {
			t.Errorf("Error closing response body: %s", err)
		}
	}()

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
	serverComponents, err := di.InitializeServer()
	if err != nil {
		t.Errorf("Error initializing server: %s", err)
		return
	}

	testServer := httptest.NewServer(serverComponents.Echo)
	t.Cleanup(func() {
		testServer.Close()
		serverComponents.Client.CloseDB()
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

	defer func() {
		if err := r.Body.Close(); err != nil {
			t.Errorf("Error closing response body: %s", err)
		}
	}()

	body, err := io.ReadAll(r.Body)
	if err != nil {
		t.Errorf("Error reading response body: %s", err)
		return
	}

	assert.Equal(t, http.StatusCreated, r.StatusCode)
	assert.Contains(t, string(body), "窪坂駿吾")
}

func TestGetCampusDonationBuildingFloorsHandler(t *testing.T) {
	prepareTestDatabase(t)

	serverComponents, err := di.InitializeServer()
	if err != nil {
		t.Errorf("Error initializing server: %s", err)
		return
	}

	testServer := httptest.NewServer(serverComponents.Echo)
	t.Cleanup(func() {
		testServer.Close()
		serverComponents.Client.CloseDB()
	})

	r, err := http.Get(testServer.URL + "/campus_donations/years/2025/group_keys/campus_donation_test/floors?floor_number=5")
	if err != nil {
		t.Errorf("Error making request: %s", err)
		return
	}

	defer func() {
		if err := r.Body.Close(); err != nil {
			t.Errorf("Error closing response body: %s", err)
		}
	}()

	var buildingFloors []generated.CampusDonationBuildingFloor
	if err := json.NewDecoder(r.Body).Decode(&buildingFloors); err != nil {
		t.Errorf("Error decoding response body: %s", err)
		return
	}

	assert.Equal(t, http.StatusOK, r.StatusCode)
	assert.Equal(t, []generated.CampusDonationBuildingFloor{
		{
			BuildingId:   1,
			BuildingName: "学内募金API確認棟",
			UnitNumber:   1,
			FloorNumber:  "5",
			Donations: []generated.CampusDonationTeacher{
				{
					RoomName:    "501",
					TeacherId:   1,
					TeacherName: "学内募金API確認教員A",
					TotalPrice:  5000,
					IsBlack:     false,
				},
				{
					RoomName:    "502",
					TeacherId:   2,
					TeacherName: "学内募金API確認教員B",
					TotalPrice:  0,
					IsBlack:     true,
				},
			},
		},
		{
			BuildingId:   2,
			BuildingName: "学内募金API確認棟",
			UnitNumber:   2,
			FloorNumber:  "5",
			Donations: []generated.CampusDonationTeacher{
				{
					RoomName:    "501",
					TeacherId:   3,
					TeacherName: "学内募金API確認教員C",
					TotalPrice:  7000,
					IsBlack:     false,
				},
			},
		},
	}, buildingFloors)
}

func TestGetCampusDonationBuildingFloorsHandlerWithoutFloorNumber(t *testing.T) {
	prepareTestDatabase(t)

	serverComponents, err := di.InitializeServer()
	if err != nil {
		t.Errorf("Error initializing server: %s", err)
		return
	}

	testServer := httptest.NewServer(serverComponents.Echo)
	t.Cleanup(func() {
		testServer.Close()
		serverComponents.Client.CloseDB()
	})

	r, err := http.Get(testServer.URL + "/campus_donations/years/2025/group_keys/campus_donation_test/floors")
	if err != nil {
		t.Errorf("Error making request: %s", err)
		return
	}

	defer func() {
		if err := r.Body.Close(); err != nil {
			t.Errorf("Error closing response body: %s", err)
		}
	}()

	var buildingFloors []generated.CampusDonationBuildingFloor
	if err := json.NewDecoder(r.Body).Decode(&buildingFloors); err != nil {
		t.Errorf("Error decoding response body: %s", err)
		return
	}

	assert.Equal(t, http.StatusOK, r.StatusCode)
	assert.Equal(t, []generated.CampusDonationBuildingFloor{
		{
			BuildingId:   1,
			BuildingName: "学内募金API確認棟",
			UnitNumber:   1,
			FloorNumber:  "5",
			Donations: []generated.CampusDonationTeacher{
				{
					RoomName:    "501",
					TeacherId:   1,
					TeacherName: "学内募金API確認教員A",
					TotalPrice:  5000,
					IsBlack:     false,
				},
				{
					RoomName:    "502",
					TeacherId:   2,
					TeacherName: "学内募金API確認教員B",
					TotalPrice:  0,
					IsBlack:     true,
				},
			},
		},
		{
			BuildingId:   2,
			BuildingName: "学内募金API確認棟",
			UnitNumber:   2,
			FloorNumber:  "4",
			Donations: []generated.CampusDonationTeacher{
				{
					RoomName:    "401",
					TeacherId:   4,
					TeacherName: "学内募金API確認教員D",
					TotalPrice:  9000,
					IsBlack:     false,
				},
			},
		},
		{
			BuildingId:   2,
			BuildingName: "学内募金API確認棟",
			UnitNumber:   2,
			FloorNumber:  "5",
			Donations: []generated.CampusDonationTeacher{
				{
					RoomName:    "501",
					TeacherId:   3,
					TeacherName: "学内募金API確認教員C",
					TotalPrice:  7000,
					IsBlack:     false,
				},
			},
		},
	}, buildingFloors)
}
