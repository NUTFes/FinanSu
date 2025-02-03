USE finansu_db;

CREATE TABLE buy_reports (
    id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    festival_item_id INT(10) UNSIGNED NOT NULL,
    amount INT(10) NOT NULL,
    memo VARCHAR(255) NOT NULL,
    paid_by VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY festival_item_id_foreign_key (festival_item_id) REFERENCES festival_items (id)
);

INSERT INTO buy_reports (festival_item_id, amount, memo, paid_by) VALUES (1, 5000, '', 'テスト太郎');
INSERT INTO buy_reports (festival_item_id, amount, memo, paid_by) VALUES (1, 4000, '', 'テスト太郎');
INSERT INTO buy_reports (festival_item_id, amount, memo, paid_by) VALUES (2, 5000, '', 'テスト太郎');
INSERT INTO buy_reports (festival_item_id, amount, memo, paid_by) VALUES (3, 2000, '', 'テスト2太郎');
INSERT INTO buy_reports (festival_item_id, amount, memo, paid_by) VALUES (3, 2000, '', 'テスト2太郎');
INSERT INTO buy_reports (festival_item_id, amount, memo, paid_by) VALUES (3, 2000, '', 'テスト2太郎');
INSERT INTO buy_reports (festival_item_id, amount, memo, paid_by) VALUES (4, 10000, '', 'テスト3太郎');
