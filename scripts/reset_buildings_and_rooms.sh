#!/bin/bash

set -eu

MYSQL_HOST="db"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

mysql -h "$MYSQL_HOST" -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" < "$SCRIPT_DIR/reset_buildings_and_rooms.sql"
