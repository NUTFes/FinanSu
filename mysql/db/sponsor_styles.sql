use finansu_db;

CREATE TABLE sponsor_styles (
  id int(10) unsigned not null auto_increment,
  style varchar(255) not null,
  feature varchar(255) not null,
  price int(10),
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  PRIMARY KEY (id)
);

INSERT into sponsor_styles (style, feature, price) values ('8分の1', 'モノクロ', 3000);
INSERT into sponsor_styles (style, feature, price) values ('8分の1', 'カラー', 5000);
INSERT into sponsor_styles (style, feature, price) values ('4分の1', 'モノクロ', 8000);
INSERT into sponsor_styles (style, feature, price) values ('4分の1', 'カラー', 10000);
INSERT into sponsor_styles (style, feature, price) values ('2分の1', 'モノクロ', 12000);
INSERT into sponsor_styles (style, feature, price) values ('2分の1', 'カラー', 15000);
INSERT into sponsor_styles (style, feature, price) values ('1ページ', 'モノクロ', 20000);
INSERT into sponsor_styles (style, feature, price) values ('2ページ', 'カラー', 30000);
INSERT into sponsor_styles (style, feature, price) values ('企業ブース', 'なし', 30000);
