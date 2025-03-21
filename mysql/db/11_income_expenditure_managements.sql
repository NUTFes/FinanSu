USE finansu_db;

CREATE TABLE income_expenditure_managements (
    id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    content VARCHAR(255) NOT NULL,
    amount INT(10) NOT NULL,
    -- paid_by VARCHAR(255) NOT NULL, // 確認中
    log_category ENUM("income", "expenditure", "sponsor's income") NOT NULL,
    year_id INT(10) UNSIGNED NOT NULL,
    is_checked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY year_id_foreign_key (year_id) REFERENCES years (id) ON DELETE CASCADE
);
