USE finansu_db;

CREATE TABLE festival_items (
    id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    memo VARCHAR(255),
    division_id INT(10) UNSIGNED NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY division_id_foreign_key (division_id) REFERENCES divisions (id)
);

INSERT INTO festival_items (name, memo, division_id) VALUES ('物品A', '', 1);
INSERT INTO festival_items (name, memo, division_id) VALUES ('物品B', '', 1);
INSERT INTO festival_items (name, memo, division_id) VALUES ('物品C', '', 2);
INSERT INTO festival_items (name, memo, division_id) VALUES ('物品D', '', 2);
INSERT INTO festival_items (name, memo, division_id) VALUES ('物品E', '', 3);
INSERT INTO festival_items (name, memo, division_id) VALUES ('物品F', '', 3);
INSERT INTO festival_items (name, memo, division_id) VALUES ('物品G', '', 4);
INSERT INTO festival_items (name, memo, division_id) VALUES ('物品H', '', 4);
INSERT INTO festival_items (name, memo, division_id) VALUES ('物品I', '', 5);
INSERT INTO festival_items (name, memo, division_id) VALUES ('物品J', '', 5);
INSERT INTO festival_items (name, memo, division_id) VALUES ('物品K', '', 6);
INSERT INTO festival_items (name, memo, division_id) VALUES ('物品L', '', 6);
INSERT INTO festival_items (name, memo, division_id) VALUES ('物品M', '', 7);
INSERT INTO festival_items (name, memo, division_id) VALUES ('物品N', '', 7);
INSERT INTO festival_items (name, memo, division_id) VALUES ('物品O', '', 8);
INSERT INTO festival_items (name, memo, division_id) VALUES ('物品P', '', 8);
INSERT INTO festival_items (name, memo, division_id) VALUES ('物品Q', '', 9);
INSERT INTO festival_items (name, memo, division_id) VALUES ('物品R', '', 9);
INSERT INTO festival_items (name, memo, division_id) VALUES ('物品S', '', 10);
INSERT INTO festival_items (name, memo, division_id) VALUES ('物品T', '', 10);
INSERT INTO festival_items (name, memo, division_id) VALUES ('物品U', '', 11);
INSERT INTO festival_items (name, memo, division_id) VALUES ('物品V', '', 11);
INSERT INTO festival_items (name, memo, division_id) VALUES ('物品W', '', 12);
INSERT INTO festival_items (name, memo, division_id) VALUES ('物品X', '', 12);
