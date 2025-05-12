read -p "input migration name: " migration_name

docker compose -f compose.migrate.yml run --rm migrate create -ext sql -dir /migrations -seq $migration_name
