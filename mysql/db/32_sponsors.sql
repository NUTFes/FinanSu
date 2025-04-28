use finansu_db;

CREATE TABLE
  sponsors (
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

INSERT INTO
  sponsors (name, tel, email, address, representative)
VALUES
  ('テスト企業', '00000000000', 'test@nutfes.com', '新潟県長岡市上富岡町', '技大太郎'),
  ('テスト企業2', '08000000000', 'test2@nutfes.com', '新潟県長岡市上富岡町', 'いまいまい'),
  ('テスト企業3', '09000000000', 'test3@nutfes.com', '新潟県長岡市上富岡町', 'いまいまい2');
