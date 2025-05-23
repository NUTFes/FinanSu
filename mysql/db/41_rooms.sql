use finansu_db
CREATE TABLE
  rooms (
    id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    floor_id INT(10) UNSIGNED not null,
    room_name varchar(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (floor_id) REFERENCES floors (id)
  );

INSERT INTO
  rooms (floor_id, room_name)
VALUES
  (1, 'test部屋')
