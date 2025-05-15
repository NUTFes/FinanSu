use finansu_db;

CREATE TABLE campus_donations (
  id int(10) unsigned not null auto_increment,
  user_id int(10) not null,
  teacher_id int(10) not null,
  price int(10) not null,
  remark varchar(255),
  received_at varchar(255) not null,
  year_id INT(10) UNSIGNED NOT NULL,
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  PRIMARY KEY (id)
);

INSERT INTO campus_donations (user_id, teacher_id, price, remark, received_at, year_id)
VALUES (1, 1, 2000, "nothing", '2023-02-22', 2023),
       (2, 2, 2000, "nothing", '2022-02-22', 2022);
