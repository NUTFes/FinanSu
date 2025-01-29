USE finansu_db;

CREATE TABLE item_budgets (
    id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    amount INT(10) NOT NULL,
    festival_item_id INT(10) UNSIGNED NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY festival_item_id_foreign_key (festival_item_id) REFERENCES festival_items (id)
);

INSERT INTO item_budgets (amount, festival_item_id) VALUES (1000, 1);
INSERT INTO item_budgets (amount, festival_item_id) VALUES (500, 2);
INSERT INTO item_budgets (amount, festival_item_id) VALUES (2000, 3);
INSERT INTO item_budgets (amount, festival_item_id) VALUES (0, 4);
INSERT INTO item_budgets (amount, festival_item_id) VALUES (3000, 5);
INSERT INTO item_budgets (amount, festival_item_id) VALUES (500, 6);
INSERT INTO item_budgets (amount, festival_item_id) VALUES (2000, 7);
INSERT INTO item_budgets (amount, festival_item_id) VALUES (1500, 8);
INSERT INTO item_budgets (amount, festival_item_id) VALUES (4000, 9);
INSERT INTO item_budgets (amount, festival_item_id) VALUES (3000, 10);
INSERT INTO item_budgets (amount, festival_item_id) VALUES (1000, 11);
INSERT INTO item_budgets (amount, festival_item_id) VALUES (1500, 12);
INSERT INTO item_budgets (amount, festival_item_id) VALUES (3000, 13);
INSERT INTO item_budgets (amount, festival_item_id) VALUES (2000, 14);
INSERT INTO item_budgets (amount, festival_item_id) VALUES (1000, 15);
INSERT INTO item_budgets (amount, festival_item_id) VALUES (2500, 16);
INSERT INTO item_budgets (amount, festival_item_id) VALUES (4000, 17);
INSERT INTO item_budgets (amount, festival_item_id) VALUES (3000, 18);
INSERT INTO item_budgets (amount, festival_item_id) VALUES (1000, 19);
INSERT INTO item_budgets (amount, festival_item_id) VALUES (2500, 20);
INSERT INTO item_budgets (amount, festival_item_id) VALUES (4000, 21);
INSERT INTO item_budgets (amount, festival_item_id) VALUES (3000, 22);
INSERT INTO item_budgets (amount, festival_item_id) VALUES (1000, 23);
INSERT INTO item_budgets (amount, festival_item_id) VALUES (2500, 24);
