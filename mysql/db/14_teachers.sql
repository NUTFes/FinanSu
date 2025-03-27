use finansu_db;

CREATE TABLE teachers (
  id int (10) unsigned not null auto_increment,
  name varchar(255) not null,
  position varchar(255) not null,
  department_id int(10) UNSIGNED,
  teacher_room_id int(10) UNSIGNED,
  is_black boolean,
  remark varchar(255),
  is_deleted boolean default false,
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  PRIMARY KEY (id),
  FOREIGN KEY (teacher_room_id) REFERENCES teacher_rooms(id),
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

INSERT into teachers (name, position, department_id, is_black, remark) values ('test-name', 'test-position', 1, false, "test-remark");
INSERT into teachers (name, position, department_id, is_black, remark) values ('test-teacher', 'test-position2', 1, false, "test-remark");
