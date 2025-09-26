USE finansu_db;

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

-- シードデータ挿入
-- buy_report_income_expenditure_managements のシードデータ挿入
INSERT INTO
    buy_report_income_expenditure_managements (buy_report_id, income_expenditure_management_id, created_at, updated_at)
VALUES
    (1, 3, NOW(), NOW()), -- buy_reports.id: 1 と income_expenditure_managements.id: 3 の対応
    (2, 4, NOW(), NOW()), -- buy_reports.id: 2 と income_expenditure_managements.id: 4 の対応
    (3, 5, NOW(), NOW()), -- buy_reports.id: 3 と income_expenditure_managements.id: 5 の対応
    (4, 6, NOW(), NOW()), -- buy_reports.id: 4 と income_expenditure_managements.id: 6 の対応
    (5, 7, NOW(), NOW()), -- buy_reports.id: 5 と income_expenditure_managements.id: 7 の対応
    (6, 8, NOW(), NOW()), -- buy_reports.id: 6 と income_expenditure_managements.id: 8 の対応
    (7, 9, NOW(), NOW());

-- buy_reports.id: 7 と income_expenditure_managements.id: 9 の対応
