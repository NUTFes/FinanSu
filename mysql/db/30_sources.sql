use finansu_db;

CREATE TABLE
  sources (
    id int(10) unsigned not null auto_increment,
    name varchar(255) not null,
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    PRIMARY KEY (id)
  );

INSERT into
  sources (name)
values
  ('教育振興会費');
