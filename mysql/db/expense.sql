use finansu_db;

CREATE TABLE expense (
  id int(10) unsigned not null auto_increment,
  expense_name varchar(255) not null,
  totalPrice int(10) default 0,
  yearID int(10),
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  PRIMARY KEY (id)
);

INSERT into expense (expense_name,yearID) values ("企画局",2);
INSERT into expense (expense_name,yearID) values ("総務局",2);
INSERT into expense (expense_name,yearID) values ("情報局",2);
INSERT into expense (expense_name,yearID) values ("制作局",2);
INSERT into expense (expense_name,yearID) values ("渉外局",2);
INSERT into expense (expense_name,yearID) values ("財務局",2);

CREATE TABLE tmp (
  id int(10) NOT NULL,
  totalPrice int(10),
  purchase_reports_id int(10),
  addition int(10), discount int(10),
  expense_id int(10),
  finance_check boolean,
  PRIMARY KEY (`id`)
);

CREATE TABLE tmp2 (
  id int(10) NOT NULL,
  totalPrice int(10) NOT NULL,
  PRIMARY KEY (`id`)
);
