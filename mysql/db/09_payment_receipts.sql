USE finansu_db;

CREATE TABLE payment_receipts (
    id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    buy_report_id INT(10) UNSIGNED NOT NULL,
    bucket_name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(255) NOT NULL,
    remark VARCHAR(255),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
    FOREIGN KEY buy_report_id_foreign_key (buy_report_id) REFERENCES buy_reports (id)
);
