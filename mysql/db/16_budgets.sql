use finansu_db;

CREATE TABLE
  budgets (
    id int(10) unsigned not null auto_increment,
    price int(10) not null,
    year_id int(10),
    source_id int(10),
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    PRIMARY KEY (id)
  );

INSERT into
  budgets (price, year_id, source_id)
values
  (10000, 1, 1);
