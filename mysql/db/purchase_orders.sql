use finansu_db;

CREATE TABLE purchase_orders (
  id int(10) unsigned not null auto_increment,
  deadline varchar(255),
  user_id int(10),
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  PRIMARY KEY (id)
);

INSERT into purchase_orders (deadline, user_id) values ('2022-2-22', 1);
