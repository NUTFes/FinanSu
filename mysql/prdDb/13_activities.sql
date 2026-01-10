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

CREATE TABLE
  activity_styles (
    id int(10) unsigned not null auto_increment,
    activity_id int(10),
    sponsor_style_id int(10),
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    PRIMARY KEY (id)
  );
