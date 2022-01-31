use finansu_db;

CREATE TABLE teachers(
  id int(10) unsigned not null auto_increment,
  name varchar(255) not null,
  position varchar(255) not null,
  department_id int(10),
  room varchar(255),
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  PRIMARY KEY (id)
);

INSERT into teachers (name,position,department_id,room) values ('test-name','test-position', 1,'605');