USE finansu_db;

CREATE TABLE item_budgets (
    id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    amount INT(10) NOT NULL,
    festival_item_id INT(10) UNSIGNED NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
    FOREIGN KEY festival_item_id_foreign_key (festival_item_id) REFERENCES festival_items (id)
);
