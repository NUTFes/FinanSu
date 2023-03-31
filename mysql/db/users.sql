use finansu_db;

CREATE TABLE users (
  id int(10) unsigned not null auto_increment,
  name varchar(255) not null,
  bureau_id int(10) not null,
  role_id int(10) not null,
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  PRIMARY KEY (id)
);

INSERT into users (name, bureau_id, role_id) values ('技大太郎1', 1, 1);
INSERT into users (name, bureau_id, role_id) values ('技大太郎2', 1, 2);
INSERT into users (name, bureau_id, role_id) values ('技大太郎3', 1, 3);
INSERT into users (name, bureau_id, role_id) values ('技大太郎4', 1, 4);
