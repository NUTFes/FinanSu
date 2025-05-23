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
