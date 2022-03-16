use finansu_db;

CREATE TABLE sponsor_styles (
  id int(10) unsigned not null auto_increment,
  scale varchar(255) not null,
  is_color boolean,
  price int(10),
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  PRIMARY KEY (id)
);

INSERT into sponsor_styles (scale, is_color, price) values ('8分の1', false, 3000);
INSERT into sponsor_styles (scale, is_color, price) values ('8分の1', true, 5000);
INSERT into sponsor_styles (scale, is_color, price) values ('4分の1', false, 8000);
INSERT into sponsor_styles (scale, is_color, price) values ('4分の1', true, 10000);
INSERT into sponsor_styles (scale, is_color, price) values ('2分の1', false, 12000);
INSERT into sponsor_styles (scale, is_color, price) values ('2分の1', true, 15000);
INSERT into sponsor_styles (scale, is_color, price) values ('1分の1', false, 20000);
INSERT into sponsor_styles (scale, is_color, price) values ('1分の1', true, 30000);
