use finansu_db;

CREATE TABLE session (
  id int(10) unsigned not null unique auto_increment,
  auth_id int(10) not null,
  user_id int(10) not null,
  access_token varchar(255) not null,
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  PRIMARY KEY (auth_id)
);
