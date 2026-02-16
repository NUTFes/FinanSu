-- テーブル作成: sponsorship_activities
CREATE TABLE IF NOT EXISTS sponsorship_activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  year_periods_id INT NOT NULL COMMENT '年度期間ID',
  sponsor_id INT NOT NULL COMMENT '企業ID',
  user_id INT NOT NULL COMMENT '担当者ID',
  activity_status ENUM(
    'unstarted',
    'material_sent',
    'forms_sent',
    'confirmed',
    'invoice_sent',
    'payment_confirmed',
    'receipt_sent',
    'rejected'
  ) NOT NULL DEFAULT 'unstarted' COMMENT '活動ステータス',
  feasibility_status ENUM(
    'unstarted',
    'possible',
    'impossible'
  ) NOT NULL DEFAULT 'unstarted' COMMENT '協賛可否',
  design_progress ENUM(
    'unstarted',
    'created_by_student',
    'created_by_company',
    'completed'
  ) NOT NULL DEFAULT 'unstarted' COMMENT 'デザイン進捗',
  remarks TEXT COMMENT '備考',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sponsor_id) REFERENCES sponsors(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
  -- year_periodsテーブルがあるなら外部キー推奨
  -- FOREIGN KEY (year_periods_id) REFERENCES year_periods(id)
);

-- テーブル作成: activity_sponsor_style_links (中間テーブル)
CREATE TABLE IF NOT EXISTS activity_sponsor_style_links (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sponsorship_activity_id INT NOT NULL,
  sponsor_style_id INT NOT NULL,
  category ENUM('money', 'goods') NOT NULL DEFAULT 'money' COMMENT '金銭/物品',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sponsorship_activity_id) REFERENCES sponsorship_activities(id) ON DELETE CASCADE,
  FOREIGN KEY (sponsor_style_id) REFERENCES sponsor_styles(id)
);