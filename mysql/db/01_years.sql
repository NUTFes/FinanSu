use finansu_db;

CREATE TABLE
  years (
    id int(10) unsigned not null auto_increment,
    year int(10) not null,
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    PRIMARY KEY (id)
  );

INSERT INTO
  years (year)
VALUES
  (2023),
  (2024),
  (2025);
