use finansu_db;

CREATE TABLE departments (
  id int(10) unsigned not null auto_increment,
  name varchar(255),
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  PRIMARY KEY (id)
);

INSERT into departments (name) values ('電気電子情報');
INSERT into departments (name) values ('生物機能');
INSERT into departments (name) values ('機械創造');
INSERT into departments (name) values ('物質材料');
INSERT into departments (name) values ('環境社会基盤');
INSERT into departments (name) values ('情報・経営システム');
INSERT into departments (name) values ('基盤共通教育');
INSERT into departments (name) values ('原子力システム安全');
INSERT into departments (name) values ('技術科学イノベーション');
INSERT into departments (name) values ('システム安全');
INSERT into departments (name) values ('技術支援');
INSERT into departments (name) values ('その他');
INSERT into departments (name) values ('学長・事務');
INSERT into departments (name) values ('FL');

