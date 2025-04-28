USE finansu_db;

CREATE TABLE
    item_budgets (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        amount INT(10) NOT NULL,
        festival_item_id INT(10) UNSIGNED NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY festival_item_id_foreign_key (festival_item_id) REFERENCES festival_items (id) ON DELETE CASCADE
    );

INSERT INTO
    item_budgets (amount, festival_item_id)
VALUES
    (10000, 1),
    (10000, 2),
    (10000, 3),
    (20000, 4),
    (50000, 5),
    (1500000, 6),
    (10000, 7);
