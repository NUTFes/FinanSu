use finansu_db;

CREATE TABLE users (
  id int(10) unsigned not null auto_increment,
  name varchar(255) not null,
  bureau_id int(10) not null,
  role_id int(10) not null,
  id_deleted boolean,
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  PRIMARY KEY (id)
);

-- 一般ユーザー
INSERT into users (name, bureau_id, role_id) values ('技大太郎1', 1, 1, false);

-- 管理者ユーザー
INSERT into users (name, bureau_id, role_id) values ('技大太郎2', 6, 2, false);

-- 財務局長
INSERT into users (name, bureau_id, role_id) values ('技大太郎3', 3, 3, false);

-- 一般ユーザー（財務局員）
INSERT into users (name, bureau_id, role_id) values ('技大太郎4', 3, 1, false);
