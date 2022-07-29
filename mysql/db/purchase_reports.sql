use finansu_db;

CREATE TABLE purchase_reports (
  id int(10) unsigned not null auto_increment,
  user_id int(10),
  discount int(10),
  addition int(10),
  finance_check boolean,
  purchase_order_id int(10),
  remark varchar(255),
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  PRIMARY KEY (id)
);

INSERT into purchase_reports (user_id, discount, addition, finance_check, purchase_order_id, remark) values (1, 100, 200, true, 1, 'test-remark');
INSERT into purchase_reports (user_id, discount, addition, finance_check, purchase_order_id, remark) values (2, 200, 400, false, 2, 'test-remark2');
INSERT into purchase_reports (user_id, discount, addition, finance_check, purchase_order_id, remark) values (3, 400, 800, true, 1, 'test-remark3');

