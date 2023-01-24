build:
	docker compose build
	docker compose run --rm view npm install
run:
	docker compose up
run-api:
	docker compose up -d db
	docker compose up api
down:
	docker compose down
seed:
	docker compose run --rm api go mod tidy
	docker compose run --rm api go run /app/tools/seeds/teacher_seeds.go
