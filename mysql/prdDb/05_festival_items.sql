USE finansu_db;

CREATE TABLE
    festival_items (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        memo VARCHAR(255),
        division_id INT(10) UNSIGNED NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY division_id_foreign_key (division_id) REFERENCES divisions (id) ON DELETE CASCADE
    );
