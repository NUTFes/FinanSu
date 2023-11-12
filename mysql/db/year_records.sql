use finansu_db;

CREATE TABLE year_records (
  id int(10) unsigned not null auto_increment,
  year_id int(10) not null,
  started_at datetime not null,
  ended_at datetime not null,
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  PRIMARY KEY (id)
);

INSERT INTO  year_records (year_id, started_at, ended_at) values (2, '2022-01-01 00:00:00', '2023-11-15 00:00:00');
INSERT INTO  year_records (year_id, started_at, ended_at) values (3, '2023-11-15 00:00:00', '2024-11-15 00:00:00');
