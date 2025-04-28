USE finansu_db;

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

USE finansu_db;

-- シードデータ挿入
INSERT INTO
    spot_sponsor_names (sponsor_name, income_expenditure_id, created_at, updated_at)
VALUES
    ("株式会社やばたにえん", 3, NOW(), NOW());
