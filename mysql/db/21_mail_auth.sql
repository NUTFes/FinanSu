use finansu_db;

CREATE TABLE
  mail_auth (
    id int(10) unsigned not null unique auto_increment,
    email varchar(255) unique,
    password varchar(255) not null,
    user_id int(10) not null,
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    PRIMARY KEY (id)
  );

INSERT INTO
  mail_auth (email, password, user_id)
VALUES
  ("test1@example.com", "$2a$10$vtmStGYxc8/HdhBYJWyztOMrdpw1QaKxsuGdi72i8iqeyp.1997ke", 1),
  ("test2@example.com", "$2a$10$vtmStGYxc8/HdhBYJWyztOMrdpw1QaKxsuGdi72i8iqeyp.1997ke", 2),
  ("test3@example.com", "$2a$10$vtmStGYxc8/HdhBYJWyJWyztOMrdpw1QaKxsuGdi72i8iqeyp.1997ke", 3),
  ("test4@example.com", "$2a$10$vtmStGYxc8/HdhBYJWyztOMrdpw1QaKxsuGdi72i8iqeyp.1997ke", 4);
