-- paid_by_user_idカラムを追加（NULL許可、ハイブリッド対応）
ALTER TABLE buy_reports
ADD COLUMN paid_by_user_id INT(10) UNSIGNED NULL AFTER paid_by,
ADD CONSTRAINT paid_by_user_id_foreign_key 
    FOREIGN KEY (paid_by_user_id) REFERENCES users(id) ON DELETE SET NULL;

-- インデックスを追加してフィルタリングのパフォーマンスを向上
CREATE INDEX idx_buy_reports_paid_by_user_id ON buy_reports(paid_by_user_id);
