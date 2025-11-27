# アプリコンテナ=view,api、DBコンテナ=db,minio
include finansu.env

# アプリコンテナのイメージのビルド
build:
	docker compose build
	docker compose run --rm view npm install


build-stg:
	docker compose -f compose.stg.yml build


# アプリコンテナの起動
run:
	docker compose up -d

# アプリコンテナの停止
down:
	docker compose down

# dbコンテナの起動(基本ずっと起動しておく)
run-db:
	docker compose -f compose.db.yml up -d

# dbコンテナの起動 + マイグレーション + シードデータ投入
run-db-init:
	docker compose -f compose.db.yml up -d
	./scripts/wait-for-mysql.sh
	make migrate
	make seed-db
	@echo "Database initialization completed!"

# dbコンテナの停止(ずっと起動したくない時はこっちで停止)
stop-db:
	docker compose -f compose.db.yml down

build-run:
# ビルドと起動
	docker compose -f compose.db.yml up -d
	docker compose up --build

# アプリコンテナボリュームの削除
del-vol:
	docker compose down -v

# 生成したコンテナ、イメージ、ボリューム、ネットワークを一括削除
del-all:
	docker compose down --rmi all --volumes --remove-orphans

# ボリューム削除→ビルド→起動
run-rebuild:
	docker compose down -v
	docker compose up --build

# dbとminioの停止とボリューム削除(dbを初期化したい時)
del-db:
	docker compose -f compose.db.yml down --volumes

# apiの起動(db起動後)
run-api:
	docker compose up api

# StoryBookの起動
run-sb:
	docker compose run --rm -p6006:6006 view npm run storybook

seed:
	docker compose run --rm api go mod tidy
	docker compose run --rm api go run /app/tools/seeds/teacher_seeds.go

# 本番環境デプロイ
deploy:
	docker compose -f compose.prod.yml build
	docker compose -f compose.prod.yml up -d

# ローカルで本番設定で起動
run-prod:
	docker compose -f compose.local-prod.yml build
	docker compose -f compose.local-prod.yml up

# DB入るコマンド
ent-db:
	docker compose exec db mysql -u root -proot

# eslintの実行
run-eslint:
	docker compose exec view npm run lint

# apiテストの実行
run-test:
	docker compose exec api go test ./test -v

gen:
	make gen-api
	make gen-front-api

gen-api:
	docker compose run --rm api oapi-codegen -config /openapi/config.yaml /openapi/openapi.yaml

gen-front-api:
	docker compose run --rm view npx orval
	docker compose run --rm view npm run format

run-swagger:
	docker compose -f compose.swagger.yml up -d

run-all:
	make run-db-init
	make run
	make run-swagger

gen-er:
	docker run -v "./er:/output" --net="host" schemaspy/schemaspy:snapshot -t mysql -host localhost:3306 -db finansu_db -u root -p root -connprops  allowPublicKeyRetrieval\\=false  -s finansu_db

format:
	docker compose run --rm view npm run format

# マイグレーションの実行
migrate:
	docker compose -f compose.migrate.yml run --rm migrate \
		--path /migrations \
		--database "mysql://${NUTMEG_DB_USER}:${NUTMEG_DB_PASSWORD}@tcp(${NUTMEG_DB_HOST}:${NUTMEG_DB_PORT})/${NUTMEG_DB_NAME}" \
		up

# マイグレーションの実行(ダウングレード)
migrate-down:
	docker compose -f compose.migrate.yml run --rm migrate \
		--path /migrations \
		--database "mysql://${NUTMEG_DB_USER}:${NUTMEG_DB_PASSWORD}@tcp(${NUTMEG_DB_HOST}:${NUTMEG_DB_PORT})/${NUTMEG_DB_NAME}" \
		down

# マイグレーションファイルの作成
create-migration:
	./scripts/create_migration.sh

# シードデータの投入
seed-db:
	docker compose -f compose.db.yml run --rm db bash ./scripts/seed.sh

