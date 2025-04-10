use finansu_db

-- roomsとteachersの中間テーブル
CREATE TABLE room_teacher (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  room_id INT(10) unsigned not null,
  teacher_id INT(10) unsigned not null,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
);

INSERT INTO room_teacher (room_id, teacher_id) VALUES (1, 1)
