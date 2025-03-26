use finansu_db;

CREATE TABLE buildings(
  id int(10) unsigned not null auto_increment,
  name varchar(255) not null,
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  PRIMARY KEY (id)
);

INSERT INTO buildings (id, name) VALUES (1, '機械・建設1号棟');
INSERT INTO buildings (id, name) VALUES (2, '機械・建設2号棟');
INSERT INTO buildings (id, name) VALUES (3, '機械・建設3号棟');
INSERT INTO buildings (id, name) VALUES (4, '電気1号棟');
INSERT INTO buildings (id, name) VALUES (5, '電気2号棟');
INSERT INTO buildings (id, name) VALUES (6, '生物棟');
INSERT INTO buildings (id, name) VALUES (7, '環境・システム棟');
INSERT INTO buildings (id, name) VALUES (8, '物質・材料経営情報棟1号棟');
INSERT INTO buildings (id, name) VALUES (9, '総合研究棟');
INSERT INTO buildings (id, name) VALUES (10, '原子力・システム安全棟');
INSERT INTO buildings (id, name) VALUES (11, '事務局棟');
INSERT INTO buildings (id, name) VALUES (12, '極限エネルギ密度工学研究センター');
INSERT INTO buildings (id, name) VALUES (13, '工作センター');
INSERT INTO buildings (id, name) VALUES (14, '大型実験棟');
INSERT INTO buildings (id, name) VALUES (15, '実験実習1号棟');
INSERT INTO buildings (id, name) VALUES (16, '実験実習2号棟');
INSERT INTO buildings (id, name) VALUES (17, '博士棟');
INSERT INTO buildings (id, name) VALUES (18, 'ラジオアイソトープセンター');
INSERT INTO buildings (id, name) VALUES (19, '体育保健センター');
INSERT INTO buildings (id, name) VALUES (20, '語学センター');
INSERT INTO buildings (id, name) VALUES (21, '情報処理センター');
INSERT INTO buildings (id, name) VALUES (22, 'マルチメディアセンター');
INSERT INTO buildings (id, name) VALUES (23, 'GX棟');
INSERT INTO buildings (id, name) VALUES (24, '分析計測センター');
INSERT INTO buildings (id, name) VALUES (25, '学長室');
INSERT INTO buildings (id, name) VALUES (26, '理事室');
INSERT INTO buildings (id, name) VALUES (27, '物質・材料経営情報棟2号棟')
