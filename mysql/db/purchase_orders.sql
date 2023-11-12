use finansu_db;

CREATE TABLE purchase_orders (
  id int(10) unsigned not null auto_increment,
  deadline varchar(255),
  user_id int(10),
  expense_id int(10),
  finance_check boolean,
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  PRIMARY KEY (id)
);

INSERT into purchase_orders (deadline, user_id, expense_id, finance_check) values ('2022-2-22', 1, 1, true);
INSERT into purchase_orders (deadline, user_id, expense_id, finance_check) values ('2022-3-28', 1, 1, true);
INSERT into purchase_orders (deadline, user_id, expense_id, finance_check) values ('2022-4-6', 1, 2, true);
INSERT into purchase_orders (deadline, user_id, expense_id, finance_check) values ('2022-3-28', 1, 3, false);
INSERT into purchase_orders (deadline, user_id, expense_id, finance_check) values ('2022-4-6', 1, 4, true);
INSERT into purchase_orders (deadline, user_id, expense_id, finance_check) values ('2022-4-6', 1, 5, true);
INSERT into purchase_orders (deadline, user_id, expense_id, finance_check, created_at, updated_at) values ('2024-4-6', 1, 4, true, '2023-11-16 00:00:00', '2023-11-16 00:00:00');
INSERT into purchase_orders (deadline, user_id, expense_id, finance_check, created_at, updated_at) values ('2024-4-6', 1, 5, true, '2023-11-16 00:00:00', '2023-11-16 00:00:00');
