USE finansu_db;

CREATE TABLE divisions (
    id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    financial_record_id INT(10) UNSIGNED NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY financial_record_id_foreign_key (financial_record_id) REFERENCES financial_records (id)
);

INSERT INTO divisions (name, financial_record_id) VALUES ('衛生管理部門', 1);
INSERT INTO divisions (name, financial_record_id) VALUES ('国際部門', 1);
INSERT INTO divisions (name, financial_record_id) VALUES ('広報部門', 2);
INSERT INTO divisions (name, financial_record_id) VALUES ('ゲスト部門', 2);
