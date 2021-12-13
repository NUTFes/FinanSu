use finansu_db;

CREATE TABLE activities (
  id int(10) unsigned not null auto_increment,
  suponser_style_id int(10),
  user_id int(10),
  is_done boolean,
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  PRIMARY KEY (id)
);

INSERT into activities (suponser_style_id, user_id, is_done) values (1, 1, false);
