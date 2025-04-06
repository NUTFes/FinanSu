USE finansu_db;

CREATE TABLE income_income_expenditure_managements (
    id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    income_expenditure_id INT(10) UNSIGNED NOT NULL,
    income_id INT(10) UNSIGNED NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (income_expenditure_id) REFERENCES income_expenditure_managements (id) ON DELETE CASCADE,
    FOREIGN KEY (income_id) REFERENCES incomes (id) ON DELETE CASCADE
);

-- シードデータ挿入
INSERT INTO income_income_expenditure_managements (income_expenditure_id, income_id, created_at, updated_at)
VALUES
    (1, 4, NOW(), NOW()),
    (2, 6, NOW(), NOW());
