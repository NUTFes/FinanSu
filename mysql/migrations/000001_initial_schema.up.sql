-- 年度テーブル
CREATE TABLE
    years (
        id int(10) unsigned not null auto_increment,
        year int(10) not null,
        created_at datetime not null default current_timestamp,
        updated_at datetime not null default current_timestamp on update current_timestamp,
        PRIMARY KEY (id)
    );

-- ユーザーテーブル
CREATE TABLE
    users (
        id int(10) unsigned not null auto_increment,
        name varchar(255) not null,
        bureau_id int(10) not null,
        role_id int(10) not null,
        is_deleted boolean DEFAULT false,
        created_at datetime not null default current_timestamp,
        updated_at datetime not null default current_timestamp on update current_timestamp,
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
        year_id INT(10) UNSIGNED NOT NULL,
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
        id int(10) unsigned not null auto_increment,
        user_id int(10),
        is_done boolean,
        sponsor_id int(10),
        feature varchar(255),
        expense int(10),
        remark varchar(255),
        design int(10),
        url varchar(255),
        created_at datetime not null default current_timestamp,
        updated_at datetime not null default current_timestamp on update current_timestamp,
        PRIMARY KEY (id)
    );

-- 協賛スタイル中間テーブル
CREATE TABLE
    activity_styles (
        id int(10) unsigned not null auto_increment,
        activity_id int(10),
        sponsor_style_id int(10),
        created_at datetime not null default current_timestamp,
        updated_at datetime not null default current_timestamp on update current_timestamp,
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
        activity_id int(10),
        bucket_name varchar(255),
        file_name varchar(255),
        file_type varchar(255),
        design_progress int(10),
        file_information varchar(255),
        created_at datetime not null default current_timestamp,
        updated_at datetime not null default current_timestamp on update current_timestamp,
        PRIMARY KEY (id)
    );

-- 局テーブル
CREATE TABLE
    bureaus (
        id int(10) unsigned not null auto_increment,
        name varchar(255) not null,
        created_at datetime not null default current_timestamp,
        updated_at datetime not null default current_timestamp on update current_timestamp,
        PRIMARY KEY (id)
    );

-- 学科・分野テーブル
CREATE TABLE
    departments (
        id int(10) unsigned not null auto_increment,
        name varchar(255),
        created_at datetime not null default current_timestamp,
        updated_at datetime not null default current_timestamp on update current_timestamp,
        PRIMARY KEY (id)
    );

-- 募金テーブル
CREATE TABLE
    fund_informations (
        id int(10) unsigned not null auto_increment,
        user_id int(10) not null,
        teacher_id int(10) not null,
        price int(10) not null,
        remark varchar(255),
        is_first_check boolean,
        is_last_check boolean,
        received_at varchar(255) not null,
        created_at datetime not null default current_timestamp,
        updated_at datetime not null default current_timestamp on update current_timestamp,
        PRIMARY KEY (id)
    );

-- メール認証テーブル
CREATE TABLE
    mail_auth (
        id int(10) unsigned not null unique auto_increment,
        email varchar(255) unique,
        password varchar(255) not null,
        user_id int(10) not null,
        created_at datetime not null default current_timestamp,
        updated_at datetime not null default current_timestamp on update current_timestamp,
        PRIMARY KEY (id)
    );

-- パスワードリセットトークンテーブル
CREATE TABLE
    password_reset_tokens (
        id int(10) unsigned not null unique auto_increment,
        user_id int(10) not null,
        token varchar(255) not null,
        created_at datetime not null default current_timestamp,
        updated_at datetime not null default current_timestamp on update current_timestamp,
        PRIMARY KEY (id)
    );

-- ユーザーロールテーブル
CREATE TABLE
    roles (
        id int(10) unsigned not null auto_increment,
        name varchar(255) not null,
        created_at datetime not null default current_timestamp,
        updated_at datetime not null default current_timestamp on update current_timestamp,
        PRIMARY KEY (id)
    );

-- セッションテーブル
CREATE TABLE
    session (
        id int(10) unsigned not null unique auto_increment,
        auth_id int(10) not null,
        user_id int(10) not null,
        access_token varchar(255) not null,
        created_at datetime not null default current_timestamp,
        updated_at datetime not null default current_timestamp on update current_timestamp,
        PRIMARY KEY (auth_id)
    );

-- 協賛スタイルテーブル
CREATE TABLE
    sponsor_styles (
        id int(10) unsigned not null auto_increment,
        style varchar(255) not null,
        feature varchar(255) not null,
        price int(10),
        is_deleted boolean default false,
        created_at datetime not null default current_timestamp,
        updated_at datetime not null default current_timestamp on update current_timestamp,
        PRIMARY KEY (id)
    );

-- 協賛企業テーブル
CREATE TABLE
    sponsors (
        id int(10) unsigned not null auto_increment,
        name varchar(255) not null,
        tel varchar(255) not null,
        email varchar(255) not null,
        address varchar(255) not null,
        representative varchar(255) not null,
        created_at datetime not null default current_timestamp,
        updated_at datetime not null default current_timestamp on update current_timestamp,
        PRIMARY KEY (id)
    );

-- 教員テーブル
CREATE TABLE
    teachers (
        id int(10) unsigned not null auto_increment,
        name varchar(255) not null,
        position varchar(255) not null,
        department_id int(10),
        room varchar(255),
        is_black boolean,
        remark varchar(255),
        is_deleted boolean default false,
        created_at datetime not null default current_timestamp,
        updated_at datetime not null default current_timestamp on update current_timestamp,
        PRIMARY KEY (id)
    );

-- 年度期間テーブル
CREATE TABLE
    year_periods (
        id int(10) unsigned not null auto_increment,
        year_id int(10) not null,
        started_at datetime not null,
        ended_at datetime not null,
        created_at datetime not null default current_timestamp,
        updated_at datetime not null default current_timestamp on update current_timestamp,
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
        id int(10) unsigned not null auto_increment,
        name varchar(255) not null,
        created_at datetime not null default current_timestamp,
        updated_at datetime not null default current_timestamp on update current_timestamp,
        PRIMARY KEY (id)
    );

-- 号棟テーブル
CREATE TABLE
    building_units (
        id int(10) unsigned not null auto_increment,
        building_id int(10) unsigned not null default 1,
        unit_number varchar(255) not null,
        created_at datetime not null default current_timestamp,
        updated_at datetime not null default current_timestamp on update current_timestamp,
        PRIMARY KEY (id),
        FOREIGN KEY (building_id) REFERENCES buildings (id)
    );

-- 階テーブル
CREATE TABLE
    floors (
        id int(10) unsigned not null auto_increment,
        building_unit_id int(10) unsigned not null,
        floor_number varchar(255) not null,
        created_at datetime not null default current_timestamp,
        updated_at datetime not null default current_timestamp on update current_timestamp,
        PRIMARY KEY (id),
        FOREIGN KEY (building_unit_id) REFERENCES building_units (id)
    );

-- 部屋テーブル
CREATE TABLE
    rooms (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        floor_id INT(10) UNSIGNED not null,
        room_name varchar(255) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (floor_id) REFERENCES floors (id)
    );

-- roomsとteachersの中間テーブル
CREATE TABLE
    room_teachers (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        room_id INT(10) unsigned not null,
        teacher_id INT(10) unsigned not null,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (room_id) REFERENCES rooms (id) ON DELETE CASCADE,
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
