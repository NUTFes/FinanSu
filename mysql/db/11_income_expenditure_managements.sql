USE finansu_db;

CREATE TABLE income_expenditure_managements (
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

USE finansu_db;

-- income_expenditure_managements のシードデータ挿入
INSERT INTO income_expenditure_managements (amount, log_category, year_id, receive_option, is_checked, created_at, updated_at)
VALUES
    (50000, "income", 3, "hand", FALSE, NOW(), NOW()), -- 雑収入
    (20000, "expenditure", 3, NULL, FALSE, NOW(), NOW()), -- 情報局支出
    (100000, "sponsor's income", 3, "transfer", FALSE, NOW(), NOW()); -- 企業協賛
