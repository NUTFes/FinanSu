use finansu_db;

CREATE TABLE
  password_reset_tokens (
    id int(10) unsigned not null unique auto_increment,
    user_id int(10) not null,
    token varchar(255) not null,
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    PRIMARY KEY (id)
  );
