-- 年度テーブル
CREATE TABLE
    years (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        year INT(10) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    );

-- ユーザーテーブル
CREATE TABLE
    users (
        id int(10) unsigned not null auto_increment,
        name VARCHAR(255) NOT NULL,
        bureau_id INT(10) NOT NULL,
        role_id INT(10) NOT NULL,
        is_deleted BOOLEAN DEFAULT false,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    );

-- 局・予算テーブル
CREATE TABLE
    financial_records (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        year_id INT(10) UNSIGNED NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY year_id_foreign_key (year_id) REFERENCES years (id) ON DELETE CASCADE
    );

-- 部門テーブル
CREATE TABLE
    divisions (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        financial_record_id INT(10) UNSIGNED NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY financial_record_id_foreign_key (financial_record_id) REFERENCES financial_records (id) ON DELETE CASCADE
    );

-- 物品テーブル
CREATE TABLE
    festival_items (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        memo VARCHAR(255),
        division_id INT(10) UNSIGNED NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY division_id_foreign_key (division_id) REFERENCES divisions (id) ON DELETE CASCADE
    );

-- 予算テーブル
CREATE TABLE
    item_budgets (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        amount INT(10) NOT NULL,
        festival_item_id INT(10) UNSIGNED NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY festival_item_id_foreign_key (festival_item_id) REFERENCES festival_items (id) ON DELETE CASCADE
    );

-- ユーザー部門テーブル
CREATE TABLE
    user_groups (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        user_id INT(10) UNSIGNED NOT NULL,
        group_id INT(10) UNSIGNED NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY user_id_foreign_key (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY group_id_foreign_key (group_id) REFERENCES divisions (id) ON DELETE CASCADE
    );

-- 購入報告テーブル
CREATE TABLE
    buy_reports (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        festival_item_id INT(10) UNSIGNED NOT NULL,
        amount INT(10) NOT NULL,
        memo VARCHAR(255) NOT NULL,
        paid_by VARCHAR(255) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY festival_item_id_foreign_key (festival_item_id) REFERENCES festival_items (id) ON DELETE CASCADE
    );

-- 購入レシートテーブル
CREATE TABLE
    payment_receipts (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        buy_report_id INT(10) UNSIGNED NOT NULL,
        bucket_name VARCHAR(255) NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        file_type VARCHAR(255) NOT NULL,
        remark VARCHAR(255),
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY buy_report_id_foreign_key (buy_report_id) REFERENCES buy_reports (id) ON DELETE CASCADE
    );

-- 購入ステータステーブル
CREATE TABLE
    buy_statuses (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        buy_report_id INT(10) UNSIGNED NOT NULL,
        is_packed BOOLEAN NOT NULL DEFAULT FALSE,
        is_settled BOOLEAN NOT NULL DEFAULT FALSE,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY buy_report_id_foreign_key (buy_report_id) REFERENCES buy_reports (id) ON DELETE CASCADE
    );

-- 収支管理テーブル
CREATE TABLE
    income_expenditure_managements (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        amount INT(10) NOT NULL,
        log_category ENUM("income", "expenditure", "sponsor's income") NOT NULL,
        year_id INT(10) UNSIGNED NOT NULL, -- expenditureはNULLを許可する
        receive_option ENUM("transfer", "hand"), -- expenditureはNULLを許可する
        is_checked BOOLEAN NOT NULL DEFAULT FALSE,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY year_id_foreign_key (year_id) REFERENCES years (id) ON DELETE CASCADE
    );

-- buy_reportとincome_expenditure_managementsの中間テーブル
CREATE TABLE
    buy_report_income_expenditure_managements (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        buy_report_id INT(10) UNSIGNED NOT NULL,
        income_expenditure_management_id INT(10) UNSIGNED NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY buy_report_id_foreign_key (buy_report_id) REFERENCES buy_reports (id) ON DELETE CASCADE,
        FOREIGN KEY income_expenditure_management_id_foreign_key (income_expenditure_management_id) REFERENCES income_expenditure_managements (id) ON DELETE CASCADE
    );

-- 協賛活動テーブル
CREATE TABLE
    activities (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        user_id INT(10),
        is_done BOOLEAN,
        sponsor_id INT(10),
        feature VARCHAR(255),
        expense INT(10),
        remark VARCHAR(255),
        design INT(10),
        url VARCHAR(255),
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    );

-- 協賛スタイル中間テーブル
CREATE TABLE
    activity_styles (
        id int(10) unsigned not null auto_increment,
        activity_id INT(10),
        sponsor_style_id INT(10),
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    );

-- 協賛活動と収支管理の中間テーブル
CREATE TABLE
    sponsor_activity_balance_managements (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        sponsor_activity_id INT(10) UNSIGNED NOT NULL,
        income_expenditure_management_id INT(10) UNSIGNED NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY sponsor_activity_id_foreign_key (sponsor_activity_id) REFERENCES activities (id) ON DELETE CASCADE,
        FOREIGN KEY income_expenditure_management_id_foreign_key (income_expenditure_management_id) REFERENCES income_expenditure_managements (id) ON DELETE CASCADE
    );

-- 協賛活動情報テーブル
CREATE TABLE
    activity_informations (
        id int(10) unsigned not null auto_increment,
        activity_id INT(10),
        bucket_name VARCHAR(255),
        file_name VARCHAR(255),
        file_type VARCHAR(255),
        design_progress INT(10),
        file_information VARCHAR(255),
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    );

-- 局テーブル
CREATE TABLE
    bureaus (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    );

-- 学科・分野テーブル
CREATE TABLE
    departments (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(255),
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    );

-- メール認証テーブル
CREATE TABLE
    mail_auth (
        id INT(10) UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255) NOT NULL,
        user_id INT(10) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    );

-- パスワードリセットトークンテーブル
CREATE TABLE
    password_reset_tokens (
        id INT(10) UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT,
        user_id INT(10) NOT NULL,
        token VARCHAR(255) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    );

-- ユーザーロールテーブル
CREATE TABLE
    roles (
        id int(10) unsigned not null auto_increment,
        name VARCHAR(255) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    );

-- セッションテーブル
CREATE TABLE
    session (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        auth_id INT(10) NOT NULL,
        user_id INT(10) NOT NULL,
        access_token VARCHAR(255) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY (auth_id) -- auth_id がユニークであるべき場合
    );

-- 協賛スタイルテーブル
CREATE TABLE
    sponsor_styles (
        id int(10) unsigned not null auto_increment,
        style VARCHAR(255) NOT NULL,
        feature VARCHAR(255) NOT NULL,
        price INT(10),
        is_deleted BOOLEAN DEFAULT false,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    );

-- 協賛企業テーブル
CREATE TABLE
    sponsors (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        tel VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        representative VARCHAR(255) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    );

-- 教員テーブル
CREATE TABLE
    teachers (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        position VARCHAR(255) NOT NULL,
        department_id INT(10),
        room VARCHAR(255),
        is_black BOOLEAN,
        remark VARCHAR(255),
        is_deleted BOOLEAN DEFAULT false,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    );

-- 年度期間テーブル
CREATE TABLE
    year_periods (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        year_id INT(10) NOT NULL,
        started_at DATETIME NOT NULL,
        ended_at DATETIME NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    );

-- 収入テーブル
CREATE TABLE
    incomes (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT, -- 自動採番のID
        name VARCHAR(255) NOT NULL, -- 名前
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 作成日時
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 更新日時
        PRIMARY KEY (id) -- 主キー
    );

-- 収支管理と収入の中間テーブル
CREATE TABLE
    income_income_expenditure_managements (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        income_expenditure_id INT(10) UNSIGNED NOT NULL,
        income_id INT(10) UNSIGNED NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (income_expenditure_id) REFERENCES income_expenditure_managements (id) ON DELETE CASCADE,
        FOREIGN KEY (income_id) REFERENCES incomes (id) ON DELETE CASCADE
    );

-- 棟テーブル
CREATE TABLE
    buildings (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    );

-- 号棟テーブル
CREATE TABLE
    building_units (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        building_id INT(10) UNSIGNED NOT NULL DEFAULT 1,
        unit_number VARCHAR(255) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (building_id) REFERENCES buildings (id)
    );

-- 階テーブル
CREATE TABLE
    floors (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        building_unit_id INT(10) UNSIGNED NOT NULL,
        floor_number VARCHAR(255) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (building_unit_id) REFERENCES building_units (id)
    );

-- 部屋テーブル
CREATE TABLE
    rooms (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        floor_id INT(10) UNSIGNED NOT NULL,
        room_name VARCHAR(255) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (floor_id) REFERENCES floors (id)
    );

-- roomsとteachersの中間テーブル
CREATE TABLE
    room_teachers (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        room_id INT(10) UNSIGNED NOT NULL,
        teacher_id INT(10) UNSIGNED NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (room_id) REFERENCES rooms (id) ON DELETE CASCADE,
        FOREIGN KEY (teacher_id) REFERENCES teachers (id) ON DELETE CASCADE
    );

-- 学内募金テーブル
CREATE TABLE
    campus_donations (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        user_id INT(10) UNSIGNED NOT NULL,
        teacher_id INT(10) UNSIGNED NOT NULL,
        year_id INT(10) UNSIGNED NOT NULL,
        price INT(10) NOT NULL,
        remark VARCHAR(255),
        is_first_check BOOLEAN,
        is_last_check BOOLEAN,
        received_at VARCHAR(255) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (year_id) REFERENCES years (id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (teacher_id) REFERENCES teachers (id) ON DELETE CASCADE
    );

-- 2025年度の企業協賛の名前を登録するようのspotのテーブル
CREATE TABLE
    spot_sponsor_names (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        sponsor_name VARCHAR(255) NOT NULL,
        income_expenditure_id INT(10) UNSIGNED NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (income_expenditure_id) REFERENCES income_expenditure_managements (id) ON DELETE CASCADE
    );
