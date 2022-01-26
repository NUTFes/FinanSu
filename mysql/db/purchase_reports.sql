use finansu_db;

CREATE TABLE purchase_reports (
  id int(10) unsigned not null auto_increment,
  item varchar(255) not null,
  price int(10) not null,
  department_id int(10),
  purchase_order_id int(10),
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  PRIMARY KEY (id)
);

INSERT into purchase_reports (item, price, department_id, purchase_order_id) values ('purchase-test', 10000, 1, 1);
