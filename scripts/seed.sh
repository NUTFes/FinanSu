#!/bin/bash

# テーブルデータを初期化するためのSQLファイルを実行するよ〜！🐣

MYSQL_HOST="db"

{
  echo "SET FOREIGN_KEY_CHECKS = 0;"
  mysql -h "$MYSQL_HOST" -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" -D "$MYSQL_DATABASE" --batch --silent -N \
    -e "SELECT CONCAT('TRUNCATE TABLE \`', table_name, '\`;') \
        FROM information_schema.tables \
        WHERE table_schema = '${MYSQL_DATABASE}' AND table_name != 'schema_migrations';"
  echo "SET FOREIGN_KEY_CHECKS = 1;"
} | mysql -h "$MYSQL_HOST" -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE"

# ディレクトリのパスを指定
SQL_DIR="../seed"

# SQLファイルを順番に実行
for sql_file in "$SQL_DIR"/*.sql; do
    if [ -f "$sql_file" ]; then
        echo "実行中: $sql_file 🚀"
        mysql -h "$MYSQL_HOST" -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" < "$sql_file"
        if [ $? -eq 0 ]; then
            echo "成功: $sql_file 🎉"
        else
            echo "失敗: $sql_file 😭"
        fi
    else
        echo "SQLファイルが見つからないよ〜！ぴえん🥺"
    fi
done

echo "全てのSQLファイルの実行が完了したよ！おけまる水産🐟✨"
