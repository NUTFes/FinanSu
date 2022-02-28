use finansu_db;

CREATE TABLE fund_informations (
  id int(10) unsigned not null auto_increment,
  user_id int(10) not null,
  teacher_id int(10) not null,
  price int(10) not null,
  remark varchar(255),
  is_first_check boolean,
  is_last_check boolean,
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  PRIMARY KEY (id)
);

INSERT into fund_informations (user_id, teacher_id, price, remark, is_first_check, is_last_check) values (1, 1, 2000, "nothing", false, false);