use finansu_db;

CREATE TABLE expense (
  id int(10) unsigned not null auto_increment,
  name varchar(255) not null,
  totalPrice int(10) default 0,
  yearID int(10),
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  PRIMARY KEY (id)
);

INSERT into expense (name,totalPrice,yearID) values ("総務局",0,1);
INSERT into expense (name,totalPrice,yearID) values ("情報局",0,2);
