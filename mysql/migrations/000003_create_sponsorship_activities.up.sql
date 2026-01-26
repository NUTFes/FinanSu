-- 1. 協賛活動テーブル
CREATE TABLE
    sponsorship_activities (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        year_period_id INT(10) UNSIGNED NOT NULL COMMENT '年度期間ID',
        sponsor_id INT(10) UNSIGNED NOT NULL COMMENT '企業ID',
        user_id INT(10) UNSIGNED NOT NULL COMMENT '担当者ID',
        activity_status ENUM('未着手', '資料送付済み', 'Forms送付済み', '協賛内容確定', '請求書送付済み', '協賛金入金済み', '領収書送付済み', '協賛不可') NOT NULL DEFAULT '未着手',
        feasibility_status ENUM('未着手', '可', '不可') NOT NULL DEFAULT '未着手',
        design_progress ENUM('未着手', '学生が作成', '企業が作成', '完成') NOT NULL DEFAULT '未着手',
        remarks TEXT COMMENT '備考',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY sponsorship_activities_year_period_id_fk (year_period_id) REFERENCES year_periods (id),
        FOREIGN KEY sponsorship_activities_sponsor_id_fk (sponsor_id) REFERENCES sponsors (id),
        FOREIGN KEY sponsorship_activities_user_id_fk (user_id) REFERENCES users (id)
    );

-- 2. 協賛活動添付ファイルテーブル
CREATE TABLE
    sponsorship_activity_file_informations (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        sponsorship_activity_id INT(10) UNSIGNED NOT NULL COMMENT '協賛活動ID',
        bucket_name VARCHAR(255) NOT NULL COMMENT '保存先バケット名',
        file_name VARCHAR(255) NOT NULL COMMENT 'ファイル名',
        file_type VARCHAR(50) NOT NULL COMMENT 'ファイル種別',
        remarks TEXT COMMENT '備考',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY sponsorship_activity_file_informations_activity_id_fk (sponsorship_activity_id) REFERENCES sponsorship_activities (id) ON DELETE CASCADE
    );

-- 3. 活動とプランの紐付けテーブル
CREATE TABLE
    activity_sponsor_style_links (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        sponsorship_activity_id INT(10) UNSIGNED NOT NULL COMMENT '協賛活動ID',
        sponsor_style_id INT(10) UNSIGNED NOT NULL COMMENT '協賛プランID',
        category ENUM('金銭', '物品') NOT NULL COMMENT '区分',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY activity_sponsor_style_links_activity_id_fk (sponsorship_activity_id) REFERENCES sponsorship_activities (id) ON DELETE CASCADE,
        FOREIGN KEY activity_sponsor_style_links_style_id_fk (sponsor_style_id) REFERENCES sponsor_styles (id) ON DELETE CASCADE
    );