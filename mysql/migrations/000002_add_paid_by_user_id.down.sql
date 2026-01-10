-- paid_by_user_idカラムの削除
ALTER TABLE buy_reports
DROP FOREIGN KEY paid_by_user_id_foreign_key,
DROP INDEX idx_buy_reports_paid_by_user_id,
DROP COLUMN paid_by_user_id;
