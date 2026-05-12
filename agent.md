# Agent Notes

- `api/externals/repository` 配下でクエリを実装する場合は、原則として `goqu` を使って組み立てる。
- 既存の `dialect`（`/home/hnhk/FinanSu/api/externals/repository/dialect_repository.go`）と `ToSQL()` のパターンにそろえる。
- `JOIN` や `GROUP BY` を含む集計クエリも、生 SQL 文字列ではなく `goqu` で表現する。
- 生 SQL は `goqu` で表現が難しいケースに限って使う。
