use finansu_db;

CREATE TABLE departments (
  id int(10) unsigned not null auto_increment,
  name varchar(255),
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  PRIMARY KEY (id)
);

INSERT into departments (name) values ('総務局');
INSERT into departments (name) values ('企画局');
INSERT into departments (name) values ('渉外局');
INSERT into departments (name) values ('制作局');
INSERT into departments (name) values ('情報局');
INSERT into departments (name) values ('財務局');
