build:
	docker compose build
	docker compose run --rm view npm install
run:
	docker compose run --rm view npm install
