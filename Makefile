# アプリコンテナ=view,api、DBコンテナ=db,minio

# 配色
SHELL      := /bin/bash
BOLD       := $(shell tput bold)
UNDERLINE  := $(shell tput smul)
GREEN      := $(shell tput setaf 2)
RESET      := $(shell tput sgr0)

.PHONY: help
.DEFAULT_GOAL := help

help: ## このヘルプを表示
	@echo ""
	@echo "${BOLD}===================================================================${RESET}"
	@echo "${BOLD}                FinanSu 開発環境コマンド一覧${RESET}"
	@echo "${BOLD}===================================================================${RESET}"
	@echo ""
	@echo "${BOLD}■ 開発手順${RESET}"
	@echo "  ${BOLD}[初回セットアップ]${RESET}"
	@echo "    1. make build      # イメージビルド"
	@echo "    2. make run-db     # DBコンテナ起動"
	@echo "    3. make run        # アプリコンテナ起動"
	@echo ""
	@echo "  ${BOLD}[日常開発]${RESET}"
	@echo "    1. make run-db     # DBコンテナ起動"
	@echo "    2. make run        # アプリコンテナ起動"
	@echo ""
	@echo "${BOLD}■ 使用方法${RESET}"
	@echo "  make ${GREEN}<target>${RESET}"
	@awk 'BEGIN { \
		FS = ":.*?## "; \
		printf "\n${BOLD}■ コマンド一覧${RESET}\n"; \
	} \
	/^##@/ { \
		printf "\n${BOLD}${UNDERLINE}%s${RESET}\n", substr($$0, 5); \
	} \
	/^[a-zA-Z0-9_-]+:.*?## / { \
		printf "  ${GREEN}%-20s${RESET} %s\n", $$1, $$2; \
	}' $(MAKEFILE_LIST)
	@echo ""

##@ 開発フロー
setup: ## 開発環境をセットアップ (build > run-db > run)
	@echo "$(GREEN)--- Building images... ---$(RESET)"
	@make build
	@echo "$(GREEN)--- Starting DB containers... ---$(RESET)"
	@make run-db
	@echo "$(GREEN)--- Starting App containers... ---$(RESET)"
	@make run
	@echo "$(GREEN)--- Setup completed! ---$(RESET)"

##@ 基本操作
build: ## アプリコンテナのイメージをビルド
	docker compose build
	docker compose run --rm view npm install

build-stg: ## ステージング環境ビルド
	docker compose -f compose.stg.yml build

run: ## アプリコンテナを起動
	docker compose up -d

down: ## アプリコンテナを停止
	docker compose down

build-run: ## ビルドと起動を同時実行
	docker compose -f compose.db.yml up -d
	docker compose up --build

run-rebuild: ## ボリューム削除→ビルド→起動
	docker compose down -v
	docker compose up --build

restart: ## アプリコンテナの再起動 (DBは維持)
	@echo "$(GREEN)--- Restarting App Containers ---$(RESET)"
	docker compose down
	docker compose up -d
	@echo "$(GREEN)--- App Containers Restarted ---$(RESET)"

restart-all: ## 全コンテナの再起動
	@echo "$(GREEN)--- Restarting All Containers ---$(RESET)"
	docker compose down
	docker compose -f compose.db.yml down
	docker compose -f compose.db.yml up -d
	docker compose up -d
	@echo "$(GREEN)--- All Containers Restarted ---$(RESET)"

##@ データベース操作
run-db: ## DBコンテナを起動 (基本ずっと起動)
	docker compose -f compose.db.yml up -d

stop-db: ## DBコンテナを停止
	docker compose -f compose.db.yml down

del-db: ## DBとminioの停止とボリューム削除
	docker compose -f compose.db.yml down --volumes

ent-db: ## DB接続コマンド
	docker compose exec db mysql -u root -proot

seed: ## テストデータの投入
	docker compose run --rm api go mod tidy
	docker compose run --rm api go run /app/tools/seeds/teacher_seeds.go

##@ 実行・デバッグ
exec-api: ## APIコンテナに入る
	docker compose exec api /bin/bash

exec-view: ## Viewコンテナに入る
	docker compose exec view /bin/bash

exec-db: ## DBコンテナに入る
	docker compose -f compose.db.yml exec db /bin/bash

##@ 個別起動
run-api: ## API単体起動 (DB起動後)
	docker compose up api

run-sb: ## StoryBook起動
	docker compose run --rm -p6006:6006 view npm run storybook

run-swagger: ## Swagger起動
	docker compose -f compose.swagger.yml up -d

##@ 一括操作
run-all: ## DB・アプリ・Swaggerを一括起動
	make run-db
	make run
	make run-swagger

##@ コード生成・整形
gen: ## API・フロント両方のコード生成
	make gen-api
	make gen-front-api

gen-api: ## API側コード生成
	docker compose run --rm api oapi-codegen -config /openapi/config.yaml /openapi/openapi.yaml

gen-front-api: ## フロント側API生成
	docker compose run --rm view npx orval
	docker compose run --rm view npm run format

gen-er: ## ER図生成
	docker run -v "./er:/output" --net="host" schemaspy/schemaspy:snapshot -t mysql -host localhost:3306 -db finansu_db -u root -p root -connprops  allowPublicKeyRetrieval\\=false  -s finansu_db

format: ## コード整形
	docker compose run --rm view npm run format

##@ デバッグ・ログ
logs: ## 全コンテナのログを表示
	docker compose logs -f

logs-api: ## APIコンテナのログを表示
	docker compose logs -f api

logs-view: ## Viewコンテナのログを表示
	docker compose logs -f view

logs-db: ## DBコンテナのログを表示
	docker compose -f compose.db.yml logs -f db

logs-minio: ## Minioコンテナのログを表示
	docker compose -f compose.db.yml logs -f minio

##@ テスト・検証
run-test: ## APIテスト実行
	docker compose exec api go test ./test -v

run-eslint: ## ESLint実行
	docker compose exec view npm run lint

##@ クリーンアップ
del-vol: ## アプリコンテナボリューム削除
	docker compose down -v

del-all: ## 全てのコンテナ・イメージ・ボリューム削除
	docker compose down --rmi all --volumes --remove-orphans

##@ 本番・ステージング
deploy: ## 本番環境デプロイ
	docker compose -f compose.prod.yml build
	docker compose -f compose.prod.yml up -d

run-prod: ## ローカルで本番設定起動
	docker compose -f compose.local-prod.yml build
	docker compose -f compose.local-prod.yml up
