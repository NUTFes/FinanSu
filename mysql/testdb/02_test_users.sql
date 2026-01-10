use finansu_test_db;

CREATE TABLE
  users (
    id int(10) unsigned not null auto_increment,
    name varchar(255) not null,
    bureau_id int(10) not null,
    role_id int(10) not null,
    is_deleted boolean DEFAULT false,
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    PRIMARY KEY (id)
  );
