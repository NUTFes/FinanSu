ALTER TABLE buy_reports
  DROP FOREIGN KEY fk_buy_reports_paid_by_user,
  DROP INDEX idx_buy_reports_paid_by_user_id,
  DROP COLUMN paid_by_user_id;
