#!/bin/bash
set -e

# 環境変数から接続情報を取得
host="${NUTMEG_DB_HOST:-nutfes-finansu-db}"
port="${NUTMEG_DB_PORT:-3306}"
user="${NUTMEG_DB_USER:-finansu}"
password="${NUTMEG_DB_PASSWORD:-password}"
database="${NUTMEG_DB_NAME:-finansu_db}"

# 最大待機時間（秒）
max_wait=60
waited=0

echo "Waiting for MySQL at ${host}:${port}..."

until docker compose -f compose.db.yml exec -T db mysqladmin ping -h"localhost" -u"${user}" -p"${password}" --silent 2>/dev/null; do
  if [ $waited -ge $max_wait ]; then
    echo "Error: MySQL did not become ready within ${max_wait} seconds"
    exit 1
  fi

  echo "MySQL is unavailable - waiting... (${waited}s/${max_wait}s)"
  sleep 2
  waited=$((waited + 2))
done

echo "MySQL is ready!"
