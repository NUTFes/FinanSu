use finansu_db;

CREATE TABLE activities (
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

INSERT into activities (user_id, is_done, sponsor_id, feature, expense, remark, design, url) values (1, false, 1, "なし", 11, "" ,1 ,"");
INSERT into activities (user_id, is_done, sponsor_id, feature, expense, remark, design, url) values (2, false, 2, "クーポン", 22, "味玉or大盛無料",1 ,"");

CREATE TABLE activity_styles (
  id int(10) unsigned not null auto_increment,
  activity_id int(10),
  sponsor_style_id int(10),
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  PRIMARY KEY (id)
);

INSERT into activity_styles (activity_id, sponsor_style_id) values (1, 1);
INSERT into activity_styles (activity_id, sponsor_style_id) values (2, 2);
INSERT into activity_styles (activity_id, sponsor_style_id) values (1, 2);
INSERT into activity_styles (activity_id, sponsor_style_id) values (2, 1);
