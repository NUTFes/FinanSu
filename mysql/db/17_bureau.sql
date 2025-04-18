use finansu_db;

CREATE TABLE
  bureaus (
    id int(10) unsigned not null auto_increment,
    name varchar(255) not null,
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    PRIMARY KEY (id)
  );

INSERT INTO
  bureaus (name)
VALUES
  ('総務局'),
  ('渉外局'),
  ('財務局'),
  ('企画局'),
  ('制作局'),
  ('情報局');
