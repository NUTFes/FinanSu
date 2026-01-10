USE finansu_db;

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
