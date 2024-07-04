# アプリコンテナ=view,api、DBコンテナ=db,minio

# アプリコンテナのイメージのビルド
build:
	docker compose build
	docker compose run --rm view npm install

# アプリコンテナの起動
run:
	docker compose up

# アプリコンテナの停止
down:
	docker compose down

# dbコンテナの起動(基本ずっと起動しておく)
run-db:
	docker compose -f docker-compose.db.yml up -d

# dbコンテナの停止(ずっと起動したくない時はこっちで停止)
stop-db:
	docker compose -f docker-compose.db.yml down

# ビルドと起動
build-run:
	docker compose -f docker-compose.db.yml up -d
	docker compose up --build

# アプリコンテナボリュームの削除
del-vol:
	docker compose down -v

# 生成したコンテナ、イメージ、ボリューム、ネットワークを一括削除
del-all:
	docker-compose down --rmi all --volumes --remove-orphans

# ボリューム削除→ビルド→起動
run-rebuild:
	docker compose down -v
	docker compose up --build

# dbとminioの停止とボリューム削除(dbを初期化したい時)
del-db:
	docker-compose -f docker-compose.db.yml down --volumes

# apiの起動(db起動後)
run-api:
	docker compose up api

# StoryBookの起動
run-sb:
	docker compose run --rm view npm run storybook

seed:
	docker compose run --rm api go mod tidy
	docker compose run --rm api go run /app/tools/seeds/teacher_seeds.go

# 本番環境デプロイ
deploy:
	docker compose -f docker-compose.prod.yml build
	docker compose -f docker-compose.prod.yml up -d

# ローカル環境で本番用の設定で起動
local-deploy:
	docker compose -f docker-compose.local-prod.yml build
	docker compose -f docker-compose.local-prod.yml up

# DB入るコマンド
ent-db:
	docker compose exec db mysql -u root -proot
