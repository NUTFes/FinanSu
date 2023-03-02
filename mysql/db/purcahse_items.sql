use finansu_db;

CREATE TABLE purchase_items (
  id int(10) unsigned not null auto_increment,
  item varchar(255),
  price int(10),
  quantity int(10),
  detail varchar(255),
  url varchar(255),
  purchase_order_id int(10),
  finance_check boolean,
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  PRIMARY KEY (id)
);

INSERT into purchase_items (item, price, quantity, detail, url, purchase_order_id, finance_check )values ('test-item1', 10000, 1, 'test-detail', 'https://nutfes.net', 1, true);
-- INSERT into purchase_items (item, price, quantity, detail, url, purchase_order_id, finance_check )values ('test-item2', 20000, 2, 'test-detail2', 'https://nutfes.net', 1, false);
-- INSERT into purchase_items (item, price, quantity, detail, url, purchase_order_id, finance_check )values ('test-item3', 30000, 3, 'test-detail3', 'https://nutfes.net', 1, true); 
-- INSERT into purchase_items (item, price, quantity, detail, url, purchase_order_id, finance_check )values ('test-item4', 10000, 1, 'test-detail', 'https://nutfes.net', 2, true);
-- INSERT into purchase_items (item, price, quantity, detail, url, purchase_order_id, finance_check )values ('test-item5', 20000, 2, 'test-detail2', 'https://nutfes.net', 3, true);
-- INSERT into purchase_items (item, price, quantity, detail, url, purchase_order_id, finance_check )values ('test-item6', 30000, 3, 'test-detail3', 'https://nutfes.net', 4,  false);
-- INSERT into purchase_items (item, price, quantity, detail, url, purchase_order_id, finance_check )values ('test-item7', 10000, 1, 'test-detail', 'https://nutfes.net', 5, true);
-- INSERT into purchase_items (item, price, quantity, detail, url, purchase_order_id, finance_check )values ('test-item8', 20000, 2, 'test-detail2', 'https://nutfes.net', 5, false);
-- INSERT into purchase_items (item, price, quantity, detail, url, purchase_order_id, finance_check )values ('test-item9', 30000, 3, 'test-detail3', 'https://nutfes.net', 5, true);
