use finansu_db;

CREATE TABLE purchase_reports (
  id int(10) unsigned not null auto_increment,
  user_id int(10),
  discount int(10),
  addition int(10),
  finance_check boolean,
  purchase_order_id int(10),
  remark varchar(255),
  buyer varchar(255),
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  PRIMARY KEY (id)
);

INSERT into purchase_reports (user_id, discount, addition, finance_check, purchase_order_id, remark, buyer) values (1, 100, 200, true, 2, 'test-remark', '技大太郎1');
INSERT into purchase_reports (user_id, discount, addition, finance_check, purchase_order_id, remark, buyer) values (1, 0, 0, false, 1, 'test-remark2', '技大太郎2');
INSERT into purchase_reports (user_id, discount, addition, finance_check, purchase_order_id, remark, buyer) values (1, 400, 800, true, 3, 'test-remark3', '技大太郎3');
INSERT into purchase_reports (user_id, discount, addition, finance_check, purchase_order_id, remark, buyer) values (1, 400, 800, true, 4, 'test-remark3', '技大太郎3');
INSERT into purchase_reports (user_id, discount, addition, finance_check, purchase_order_id, remark, buyer) values (1, 400, 800, true, 5, 'test-remark3', '技大太郎3');
INSERT into purchase_reports (user_id, discount, addition, finance_check, purchase_order_id, remark, buyer) values (1, 400, 800, true, 6, 'test-remark3', '技大太郎1');
