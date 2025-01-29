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

INSERT INTO divisions (name, financial_record_id) VALUES ('制作部門A', 1);
INSERT INTO divisions (name, financial_record_id) VALUES ('制作部門B', 1);
INSERT INTO divisions (name, financial_record_id) VALUES ('渉外部門A', 2);
INSERT INTO divisions (name, financial_record_id) VALUES ('渉外部門B', 2);
INSERT INTO divisions (name, financial_record_id) VALUES ('企画部門A', 3);
INSERT INTO divisions (name, financial_record_id) VALUES ('企画部門B', 3);
INSERT INTO divisions (name, financial_record_id) VALUES ('財務部門A', 4);
INSERT INTO divisions (name, financial_record_id) VALUES ('財務部門B', 4);
INSERT INTO divisions (name, financial_record_id) VALUES ('情報部門A', 5);
INSERT INTO divisions (name, financial_record_id) VALUES ('情報部門B', 5);
INSERT INTO divisions (name, financial_record_id) VALUES ('総務部門A', 6);
INSERT INTO divisions (name, financial_record_id) VALUES ('総務部門B', 6);
