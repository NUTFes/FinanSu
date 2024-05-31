build:
	docker compose build
	docker compose run --rm view npm install
run:
	docker compose up
run-api:
	docker compose up -d db
	sleep 4
	docker compose up api
down:
	docker compose down
seed:
	docker compose run --rm api go mod tidy
	docker compose run --rm api go run /app/tools/seeds/teacher_seeds.go
local-prod-run:
	docker compose -f docker-compose.local-prod.yml build
	docker compose -f docker-compose.local-prod.yml up
prod-deploy:
	docker compose -f docker-compose.prod.yml build
	docker compose -f docker-compose.prod.yml up -d
