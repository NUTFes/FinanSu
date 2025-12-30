ALTER TABLE buy_reports
  ADD COLUMN paid_by_user_id INT(10) UNSIGNED NULL AFTER paid_by,
  ADD INDEX idx_buy_reports_paid_by_user_id (paid_by_user_id),
  ADD CONSTRAINT fk_buy_reports_paid_by_user
    FOREIGN KEY (paid_by_user_id) REFERENCES users (id)
    ON DELETE SET NULL;
