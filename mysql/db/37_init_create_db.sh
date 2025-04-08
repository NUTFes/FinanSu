#!/bin/bash

# エラーが発生したらスクリプトを終了
set -e

# docker-entrypoint-testdb.d内のSQLファイルを順番に実行
for sql_file in docker-entrypoint-testdb.d/*.sql; do
  if [ -f "$sql_file" ]; then
    mysql -u root -p$MYSQL_ROOT_PASSWORD  < "$sql_file"
  else
    echo "SQLファイルが見つかりません: docker-entrypoint-testdb.d"
  fi
done

echo "すべてのSQLファイルを実行"
