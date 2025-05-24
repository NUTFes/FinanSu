use finansu_db;

CREATE TABLE
  campus_donations (
    id int(10) unsigned not null auto_increment,
    user_id int(10) not null,
    teacher_id int(10) not null,
    year_id int(10) UNSIGNED not null,
    price int(10) not null,
    remark varchar(255),
    is_first_check boolean,
    is_last_check boolean,
    received_at varchar(255) not null,
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    PRIMARY KEY (id),
    FOREIGN KEY (year_id) REFERENCES years (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers (id) ON DELETE CASCADE
  );

INSERT INTO
  campus_donations (user_id, teacher_id, year_id, price, remark, is_first_check, is_last_check, received_at)
VALUES
  (1, 1, 3, 2000, "nothing", false, false, '2023-02-22'),
  (2, 2, 3, 2000, "nothing", false, false, '2022-02-22');
