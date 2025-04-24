USE finansu_db;

CREATE TABLE
    user_groups (
        id INT (10) UNSIGNED NOT NULL AUTO_INCREMENT,
        user_id INT (10) UNSIGNED NOT NULL,
        group_id INT (10) UNSIGNED NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY user_id_foreign_key (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY group_id_foreign_key (group_id) REFERENCES divisions (id) ON DELETE CASCADE
    );

INSERT INTO
    user_groups (user_id, group_id)
VALUES
    (119, 6),
    (119, 33);
