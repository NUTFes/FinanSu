use finansu_db;

CREATE TABLE purchase_orders (
  id int(10) unsigned not null auto_increment,
  item varchar(255),
  price int(10),
  department_id int(10),
  detail varchar(255),
  url varchar(255),
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  PRIMARY KEY (id)
);

INSERT into purchase_orders (item, price, department_id, detail, url) values ('test-parchase', 1000, 1, 'test', 'https://nutfes.net');
