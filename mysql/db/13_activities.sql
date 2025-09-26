use finansu_db;

CREATE TABLE
  activities (
    id int(10) unsigned not null auto_increment,
    user_id int(10),
    is_done boolean,
    sponsor_id int(10),
    feature varchar(255),
    expense int(10),
    remark varchar(255),
    design int(10),
    url varchar(255),
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    PRIMARY KEY (id)
  );

INSERT INTO
  activities (user_id, is_done, sponsor_id, feature, expense, remark, design, url)
VALUES
  (1, false, 1, "なし", 11, "", 1, ""),
  (2, false, 2, "クーポン", 22, "味玉or大盛無料", 1, "");

CREATE TABLE
  activity_styles (
    id int(10) unsigned not null auto_increment,
    activity_id int(10),
    sponsor_style_id int(10),
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    PRIMARY KEY (id)
  );

INSERT INTO
  activity_styles (activity_id, sponsor_style_id)
VALUES
  (1, 1),
  (2, 2),
  (1, 2),
  (2, 1);
