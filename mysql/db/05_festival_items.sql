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

INSERT INTO
    festival_items (name, memo, division_id)
VALUES
    ('農ポリ', '', 1),
    ('養生テープ', '', 1),
    ('ラミ', '', 2),
    ('広報物郵送費', '', 3),
    ('折込チラシ用費', '', 3),
    ('ゲストブッキング費', '', 4),
    ('ゲスト用菓子折り費', '', 4);
