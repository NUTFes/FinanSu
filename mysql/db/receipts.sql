use finansu_db;

CREATE TABLE receipts (
  id int(10) unsigned not null auto_increment,
  purchase_report_id int(10) not null,
  bucket_name varchar(255),
  file_name varchar(255),
  file_type varchar(255),
  remark varchar(255),
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  PRIMARY KEY (id)
);
