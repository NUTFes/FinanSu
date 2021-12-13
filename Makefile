build:
	docker compose build
	docker compose run --rm view npm install
run:
	docker compose up
run-api:
	docker compose up api
down:
	docker compose down
