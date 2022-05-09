use finansu_db;

CREATE TABLE purchase_reports (
  id int(10) unsigned not null auto_increment,
  user_id int(10),
  purchase_order_id int(10),
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  PRIMARY KEY (id)
);

INSERT into purchase_reports (user_id, purchase_order_id) values (1, 1);
INSERT into purchase_reports (user_id, purchase_order_id) values (1, 2);

