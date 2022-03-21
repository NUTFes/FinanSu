use finansu_db;

CREATE TABLE mail_auth (
  id int(10) unsigned not null unique auto_increment,
  email varchar(255) not null unique ,
  password varchar(255) not null,
  user_id int(10) not null,
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  PRIMARY KEY (id)
);

INSERT into mail_auth (email, password, user_id) values ('nutfes-taro@email.com', 'gidaifes', 1);
