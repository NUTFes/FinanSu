use finansu_db;

CREATE TABLE buildings(
  id int(10) unsigned not null auto_increment,
  name varchar(255) not null,
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  PRIMARY KEY (id)
);

INSERT INTO buildings (name) VALUES ('機械・建設棟');
INSERT INTO buildings (name) VALUES ('電気棟');
INSERT INTO buildings (name) VALUES ('生物棟');
INSERT INTO buildings (name) VALUES ('環境・システム棟');
INSERT INTO buildings (name) VALUES ('物質・材料経営情報棟');
INSERT INTO buildings (name) VALUES ('総合研究棟');
INSERT INTO buildings (name) VALUES ('原子力・システム安全棟');
INSERT INTO buildings (name) VALUES ('事務局棟');
INSERT INTO buildings (name) VALUES ('極限エネルギ密度工学研究センター');
INSERT INTO buildings (name) VALUES ('工作センター');
INSERT INTO buildings (name) VALUES ('大型実験棟');
INSERT INTO buildings (name) VALUES ('分析計測センター');
INSERT INTO buildings (name) VALUES ('その他');


-- INSERT INTO buildings (name) VALUES ('実験実習棟');
-- INSERT INTO buildings (name) VALUES ('博士棟');
-- INSERT INTO buildings (name) VALUES ('ラジオアイソトープセンター');
-- INSERT INTO buildings (name) VALUES ('体育保健センター');
-- INSERT INTO buildings (name) VALUES ('語学センター');
-- INSERT INTO buildings (name) VALUES ('情報処理センター');
-- INSERT INTO buildings (name) VALUES ('マルチメディアセンター');
-- INSERT INTO buildings (name) VALUES ('GX棟');
-- INSERT INTO buildings (name) VALUES ('学長室');
-- INSERT INTO buildings (name) VALUES ('理事室');
