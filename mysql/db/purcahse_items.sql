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

INSERT into purchase_items (item, price, quantity, detail, url, purchase_order_id, finance_check )values ('ビンゴ景品', 10000, 1, 'test-detail', 'https://nutfes.net', 1, true);
INSERT into purchase_items (item, price, quantity, detail, url, purchase_order_id, finance_check )values ('ヒーロースーツ', 20000, 2, 'test-detail2', 'https://nutfes.net', 1, false);
INSERT into purchase_items (item, price, quantity, detail, url, purchase_order_id, finance_check )values ('ビンゴ用品', 30000, 3, 'test-detail3', 'https://nutfes.net', 2, true); 
INSERT into purchase_items (item, price, quantity, detail, url, purchase_order_id, finance_check )values ('マイク', 10000, 1, 'test-detail', 'https://nutfes.net', 2, true);
INSERT into purchase_items (item, price, quantity, detail, url, purchase_order_id, finance_check )values ('机', 20000, 2, 'test-detail2', 'https://nutfes.net', 3, true);
INSERT into purchase_items (item, price, quantity, detail, url, purchase_order_id, finance_check )values ('椅子', 30000, 3, 'test-detail3', 'https://nutfes.net', 3,  false);
INSERT into purchase_items (item, price, quantity, detail, url, purchase_order_id, finance_check )values ('酒', 10000, 10, 'test-detail', 'https://nutfes.net', 4, true);
INSERT into purchase_items (item, price, quantity, detail, url, purchase_order_id, finance_check )values ('封筒', 100, 100, 'test-detail2', 'https://nutfes.net', 8, false);
INSERT into purchase_items (item, price, quantity, detail, url, purchase_order_id, finance_check )values ('領収書', 100, 50, 'test-detail3', 'https://nutfes.net', 7, true);
