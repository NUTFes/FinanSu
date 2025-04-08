use finansu_db;

CREATE TABLE bureaus(
  id int(10) unsigned not null auto_increment,
  name  varchar(255) not null,
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  PRIMARY KEY (id)
);

INSERT into bureaus(name) values ('総務局');
INSERT into bureaus(name) values ('渉外局');
INSERT into bureaus(name) values ('財務局');
INSERT into bureaus(name) values ('企画局');
INSERT into bureaus(name) values ('制作局');
INSERT into bureaus(name) values ('情報局');
