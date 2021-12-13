use finansu_db;

CREATE TABLE users (
  id int(10) unsigned not null auto_increment,
  name varchar(255) not null,
  department_id int(10) not null,
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  PRIMARY KEY (id)
);

INSERT into users (name, department_id) values ('技大太郎', 1);
