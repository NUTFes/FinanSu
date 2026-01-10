USE finansu_db;

CREATE TABLE
    buy_reports (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        festival_item_id INT(10) UNSIGNED NOT NULL,
        amount INT(10) NOT NULL,
        memo VARCHAR(255) NOT NULL,
        paid_by VARCHAR(255) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY festival_item_id_foreign_key (festival_item_id) REFERENCES festival_items (id) ON DELETE CASCADE
    );
