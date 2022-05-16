use finansu_db;

CREATE TABLE departments (
  id int(10) unsigned not null auto_increment,
  name varchar(255),
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  PRIMARY KEY (id)
);

INSERT into departments (name) values ('機械工学分野/機械創造工学課程・機械創造工学専攻');
INSERT into departments (name) values ('電気電子情報工学分野/電気電子情報工学課程/電気電子情報工学専攻');
INSERT into departments (name) values ('情報・経営システム工学分野/情報・経営システム工学課程/情報・経営システム工学専攻');
INSERT into departments (name) values ('物質生物工学分野/物質材料工学課程/生物機能工学課程/物質材料工学専攻/生物機能工学専攻');
INSERT into departments (name) values ('環境社会基盤工学分野/環境社会基盤工学課程/環境社会基盤工学専攻');
INSERT into departments (name) values ('量子・原子力統合工学分野/原子力システム安全工学専攻');

