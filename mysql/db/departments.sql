use finansu_db;

CREATE TABLE departments (
  id int(10) unsigned not null auto_increment,
  name varchar(255),
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  PRIMARY KEY (id)
);

INSERT into departments (name) values ('機械創造工学専攻');
INSERT into departments (name) values ('電気電子情報工学専攻');
INSERT into departments (name) values ('情報・経営システム工学専攻');
INSERT into departments (name) values ('物質材料工学専攻');
INSERT into departments (name) values ('環境社会基盤工学専攻');
INSERT into departments (name) values ('生物機能工学専');
INSERT into departments (name) values ('原子力安全工学専攻');

