USE finansu_db;

CREATE TABLE
    financial_records (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        year_id INT(10) UNSIGNED NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY year_id_foreign_key (year_id) REFERENCES years (id) ON DELETE CASCADE
    );

INSERT INTO
    financial_records (name, year_id)
VALUES
    ('総務局', 3),
    ('渉外局', 3);
