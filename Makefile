build:
	docker compose build
	docker compose run --rm view npm install

run:
	docker compose up

# ビルドと起動
build-run:
	docker compose up --build

# ボリュームの削除
del-vol:
	docker compose down -v

# 生成したコンテナ、イメージ、ボリューム、ネットワークを一括削除
del-all:
	docker-compose down --rmi all --volumes --remove-orphans

# ボリューム削除→ビルド→起動
del-vol-run:
	docker compose down -v
	docker compose up --build

# コンテナの停止
down:
	docker compose down

# apiのみ起動
run-api:
	docker compose up -d db
	sleep 4
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

# eslintの実行
run-eslint:
	docker compose exec view npm run lint
