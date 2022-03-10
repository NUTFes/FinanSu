use finansu_db;

CREATE TABLE purchase_items (
  id int(10) unsigned not null auto_increment,
  price int(10)
  item varchar(255),
  quantity int(10),
  detail varchar(255),
  url varchar(255),
  purchase_order_id int(10),
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  PRIMARY KEY (id)
);

INSERT into purchase_items (item, price, quantity, detail, url, purchase_order_id )values ('test-item1',10000 , 1, 'test-detail', 'https://nutfes.net', 1);