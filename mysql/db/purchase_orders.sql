use finansu_db;

CREATE TABLE purchase_orders (
  id int(10) unsigned not null auto_increment,
  item varchar(255),
  department_id int(10),
  detail varchar(255),
  url varchar(255),
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  PRIMARY KEY (id)
);

INSERT into purchase_orders (item, department_id, detail, url) values ('テスト購入品', 1, 'テスト', 'https://nutfes.net');
