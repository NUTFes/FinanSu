USE finansu_db;

CREATE TABLE
    incomes (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT, -- 自動採番のID
        name VARCHAR(255) NOT NULL, -- 名前
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 作成日時
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 更新日時
        PRIMARY KEY (id) -- 主キー
    );

INSERT INTO
    incomes (name, created_at, updated_at)
VALUES
    ("教育振興会費", NOW(), NOW()),
    ("学内募金", NOW(), NOW()),
    ("同窓会費", NOW(), NOW()),
    ("雑収入", NOW(), NOW()),
    ("繰越金", NOW(), NOW()),
    ("企業協賛金", NOW(), NOW());
