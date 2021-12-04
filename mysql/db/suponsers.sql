use finansu_db;

CREATE TABLE suponsers (
  id int(10) unsigned not null auto_increment,
  name varchar(255) not null,
  tel varchar(255) not null,
  email varchar(255) not null,
  address varchar(255) not null,
  representative varchar(255) not null,
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  PRIMARY KEY (id)
);

INSERT into suponsers (name, tel, email, address, representative) values ('テスト企業', '00000000000', 'test@nutfes.com', '新潟県長岡市上富岡町', '技大太郎');
